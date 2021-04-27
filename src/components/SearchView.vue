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
        <div class="fragment_body" style="margin:20px">
          <div v-for="num in 10" :key="num" style="padding:10px">
            <el-select v-model="deviceSelection" placeholder="请选择" @change="change1">
              <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
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
    deviceSelection: ''
  }),
  methods: {
    navigateBack() {
      let that = this
      setTimeout(() => {
        that.$router.go(-1) //返回上一层
      }, 500)
    },
    typeChange(label) {
      window.console.log(label)
      if (label == '设备') this.selectionCode = 1
      else if (label == '工单') this.selectionCode = 2
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
      // window.console.log(this.deviceSelection)
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
