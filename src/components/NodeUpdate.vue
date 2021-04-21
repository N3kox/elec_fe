<template>
  <div>
    <el-main v-if="!fromRouter"> nothing to see here </el-main>
    <el-main v-if="fromRouter">
      <div v-for="(v, k) in showNodeDetail" :key="k">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{ k }} :</div></el-col
          >
          <el-col :span="1"><div class="grid-content bg-white"></div></el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-input placeholder="请输入内容" v-model="showNodeDetail[k]" clearable />
              <!-- <el-date-picker v-model="showNodeDetail[v]" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"> </el-date-picker> -->
            </div>
          </el-col>
        </el-row>
      </div>
      <el-button type="success" plain :loading="waitingForUpdateConfirm" @click="submitNodeInfo">确认提交</el-button>
      <el-button type="info" plain @click="navigateBack">返回</el-button>
    </el-main>
  </div>
</template>

<script>
export default {
  data: () => ({
    gid: -1,
    type: '',
    showNodeDetail: {},
    fromRouter: false,
    waitingForUpdateConfirm: false,
    ticketTimeParser: ['preparedTime', 'timeToStart', 'timeToEnd'],
  }),
  methods: {
    navigateBack() {
      let that = this
      setTimeout(() => {
        that.$router.go(-1) //返回上一层
      }, 500)
    },
    submitNodeInfo() {
      let that = this
      let copy = this.deepCopy(this.showNodeDetail)
      copy.gid = this.gid
      // TODO: 增加更多gid-type-node的修改格式
      switch (this.type) {
        case 'ticket': {
          this.waitingForUpdateConfirm = true
          window.console.log(JSON.stringify(copy))
          // TODO: 修改接口地址
          this.$http.post(this.patchUrl(`/mission_ticket/update/test`), JSON.stringify(copy), { emulateJSON: true }).then((response) => {
            if (response.body == true) {
              this.$message.success('ok')
              that.waitingForUpdateConfirm = false
              that.navigateBack()
            } else {
              this.$message('failed')
            }
          })
          break
        }
        case 'staff': {
          this.$message.error('请勿直接修改用户数据')
          this.navigateBack()
          break
        }
        case 'company': {
          // TODO: 修改接口地址
          break
        }
        default: {
          this.$message('unknown node type')
          break
        }
      }
    }
  },
  mounted() {
    if (this.$route.params.node == undefined) {
      //直接点击页面处理
      window.console.log('no router info')
    } else {
      let copy = {}
      let from = this.$route.params.node
      for (let k in from) {
        if (from[k] == 'NULL') from[k] = ''
        switch(k){
          case 'gid':{
            this.gid = from[k];
            break;
          }
          case 'type':{
            this.type = from[k];
            break;
          }
          case 'preparedTime':{
            let arr = from[k].split(' ')
            copy.preparedTime_Date = arr[0];
            copy.preparedTime_Time = arr[1];
            break;
          }
          // TODO: other time split
          default:{
            copy[k] = from[k]
            break
          }
        }
        // if (k == 'gid') this.gid = from[k]
        // else if (k == 'type') this.type = from[k]
        // else if (this.ticketTimeParser.findIndex(k) > 0){

        // }
        // else copy[k] = from[k]
      }
      this.showNodeDetail = copy
      this.fromRouter = true
    }
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
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
