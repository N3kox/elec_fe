<template>
  <div id="app">
    <el-main>
      <!-- nothing to see here -->
      <div>
        <el-radio-group v-model="nodeTypeSelection" @change="typeChange">
          <el-radio-button label="设备"></el-radio-button>
          <el-radio-button label="工单"></el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="selectionCode == 1">
        <div style="margin-top: 10px">
          <el-button @click="addNewDeviceSelection">添加</el-button>
          <el-button @click="submitDeviceSelections">提交</el-button>
          <el-button @click="dropDeviceSelection">删除</el-button>
        </div>
        <div class="fragment_body" style="margin: 20px">
          <div v-for="num in deviceSelections.length" :key="num" style="padding: 10px">
            <el-select v-model="deviceSelections[num - 1].key" placeholder="请选择" @change="change1">
              <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input style="margin-left: 80px; width: 300px" v-model="deviceSelections[num - 1].val"></el-input>
          </div>
        </div>
      </div>
      <div v-if="selectionCode == 2">selection 2</div>
    </el-main>
  </div>
</template>

<script>
export default {
  data: () => ({
    gid: -1,
    type: '',
    showNodeDetail: {},
    waitingForUpdateConfirm: false,
    timerNameSave: [],
    myDateFormat: 'yyyy/M/dd HH:mm',
    nodeTypeSelection: '',
    selectionCode: 0,
    deviceOptions: [],
    ticketOptions: [],
    deviceSelections: []
  }),
  methods: {
    navigateBack() {
      let that = this
      setTimeout(() => {
        that.$router.go(-1) //返回上一层
      }, 500)
    },
    typeChange(label) {
      // window.console.log(label)
      if (label == '设备') {
        this.selectionCode = 1
        this.deviceSelections = []
        this.deviceSelections.push({
          key: '',
          val: ''
        })
      } else if (label == '工单') {
        this.selectionCode = 2
      }
    },
    parseDeviceProperties(data) {
      // window.console.log(data)
      for (let i = 0; i < data.length; i++) {
        this.deviceOptions.push({
          value: i + 1,
          label: data[i]
        })
      }
      //   window.console.log(this.deviceOptions)
    },
    change1(data) {
      // window.console.log(data)
    },

    addNewDeviceSelection() {
      this.deviceSelections.push({
        key: '',
        val: ''
      })
    },

    submitDeviceSelections() {
      let that = this
      let cp = this.deepCopy(this.deviceSelections)

      for (let i = 0; i < cp.length; i++) {
        cp[i].key = this.deviceOptions[cp[i].key - 1].label
      }
      if(cp.length == 0){
        this.$message.error("请至少填写一条属性")
        return;
      }
      
      this.$http
        .post(this.patchUrl(`/device/dynamic`), JSON.stringify(cp), { emulateJSON: true })
        .then(function(res) {
          if (res.ok == true) {
            let data = res.data
            if (data.length > 0) {
              that.$router.push({
                path: '/examples/DeviceOverview',
                name: 'DeviceOverview',
                params: {
                  data: res.data
                }
              })
            } else {
              that.$message('查询结果为空')
            }
          } else {
            that.$message.error('更新ticket失败, 请重试')
          }
        })
        .catch(function(err) {
          window.console.log(err)
        })
    },

    dropDeviceSelection() {
      if (this.deviceSelections.length > 1) {
        this.deviceSelections.pop()
      } else {
        this.$message('至少选择一个查询属性')
      }
    }
  },
  mounted() {
    let that = this
    this.$http.get(this.patchUrl(`/device/get_properties`)).then((response) => {
      if (response.data == null || response.ok == false) {
        that.$message.error('loading device properties error')
      } else {
        //   window.console.log(response.body)
        that.parseDeviceProperties(response.body)
      }
    })
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-white {
  background: white;
}
.grid-content {
  text-align: center;
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-main {
  position: absolute;
  left: 10px;
  right: 0;
  top: 10px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
