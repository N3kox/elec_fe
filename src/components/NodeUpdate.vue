<template>
  <div>
    <el-main v-if="!fromRouter"
      >nothing to see here
      
    </el-main>
    <el-main v-if="fromRouter">
      <div v-for="(v, k) in showNodeDetail" :key="k">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{ k }} :</div></el-col
          >
          <el-col :span="1"><div class="grid-content bg-white"></div></el-col>
          <el-col :span="8">
            <div class="bg-purple-light">
              <el-input v-if="timerNameSave.indexOf(k) == -1" placeholder="请输入内容" v-model="showNodeDetail[k]" clearable />
              <el-date-picker v-else v-model="showNodeDetail[k]" type="datetime" placeholder="选择日期时间" align="right" :format="myDateFormat" :value-format="myDateFormat"/>
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
    timerNameSave: [],
    myDateFormat:'yyyy/M/dd HH:mm'
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
          for(let k in copy)
            if(copy[k] == 'null') copy[k] = ''
          // window.console.log(JSON.stringify(copy))
          // TODO: 修改接口地址
          this.$http.put(this.patchUrl(`/mission_ticket/update/test2?id=${this.gid}`), JSON.stringify(copy), { emulateJSON: true }).then((response) => {
            if (response.body == true) {
              this.$message.success('ok')
              that.waitingForUpdateConfirm = false
              that.navigateBack()
            } else {
              this.$message.error('更新ticket失败, 请重试')
              that.waitingForUpdateConfirm = false;
            }
          })
          break
        }
        case 'staff': {
          this.$message.error('请勿直接修改用户数据')
          this.navigateBack()
          break
        }
        case 'route': {
          // TODO: 修改接口地址
          let that = this
          this.waitingForUpdateConfirm = true;
          for(let k in copy)
            if(copy[k] == 'null') copy[k] = ''
          this.$http.put(this.patchUrl(`/route_location/update?id=${this.gid}`), JSON.stringify(copy), {emulateJSON: true}).then((response)=>{
            if(response.body == true){
              this.$message.success("ok")
              that.waitingForUpdateConfirm = false
              that.navigateBack()
            }else{
              this.$message.error("更新RouteLocation失败，请重试")
              that.waitingForUpdateConfirm = false
            }
          })
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
      // window.console.log(from)
      for (let k in from) {
        if (from[k] == 'NULL') from[k] = ''
        switch (k) {
          case 'gid': {
            this.gid = from[k]
            // window.console.log(this.gid)
            break
          }
          case 'id' :{
            this.gid = from[k]
            break
          }
          case 'type': {
            this.type = from[k]
            window.console.log(from[k])
            break
          }
          case 'preparedTime':
          case 'timeToStart':
          case 'timeToEnd': {
            // let arr = from[k].replace(`/`, `-`) + `:00`;
            // this.value3 = arr;
            copy[k] = from[k]
            this.timerNameSave.push(k)
            break
          }
          case 'name':{
            break;
          }
          // TODO: other time split
          default: {
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
  top: 10px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
