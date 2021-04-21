<template>
  <div>
    <el-container>
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
              </div>
            </el-col>
          </el-row>
        </div>
        <el-button type="success" plain :loading="waitingForUpdateConfirm" @click="submitNodeInfo">确认提交</el-button>
        <el-button type="info" plain @click="navigateBack">返回</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    gid: -1,
    showNodeDetail: {},
    fromRouter: false,
    waitingForUpdateConfirm: false
  }),
  methods: {
    navigateBack() {
      this.$router.go(-1) //返回上一层
    },
    submitNodeInfo() {
      let that = this
      let copy = this.deepCopy(this.showNodeDetail)
      copy.gid = this.gid
      // window.console.log(this.showNodeDetail)
      this.waitingForUpdateConfirm = true
      window.console.log(JSON.stringify(copy))
      //   this.axios.post(this.patchUrl(`/mission_ticket/update/all`, JSON.stringify(copy	))).then(response =>{
      // 	  console.log(response);
      //   })
      this.$http.post(this.patchUrl(`/mission_ticket/update/test`), JSON.stringify(copy), { emulateJSON: true }).then((response) => {
        if (response.body == true) {
          this.$message('ok')
          that.waitingForUpdateConfirm = false
        } else {
          this.$message('failed')
        }
      })
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
        if (k != 'gid') {
          copy[k] = from[k]
        } else {
          this.gid = from[k]
        }
      }
      this.showNodeDetail = copy
      //   window.console.log(this.showNodeDetail)
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
</style>
