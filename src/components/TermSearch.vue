<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-aside width="50%">
        <el-col :span="10" style="margin-left:15%">
          <el-input v-model="termInput" placeholder="请输入术语内容">
            <el-button slot="append" icon="el-icon-search" @click="termInputSubmit"/>
          </el-input>
        </el-col>
        <el-col :span="24">
          <div v-for="(v,k) in termSearchResult" :key=k>
            <el-button @click="showTermDetail(k)">{{k}}</el-button>
          </div>
        </el-col>
      </el-aside>
      <el-main>
        <!-- nothing to see here -->
        这里放介绍
        <el-tree :data="termResultParsed" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    termInput: '',
    termSearchResult:{},
    termResultParsed:[]
  }),
  methods: {
    termInputSubmit(){
      let that = this
      if(this.termInput == '') return;
      this.$http.post(this.patchUrl('/source/term_search'), JSON.stringify(this.termInput), {emulateJSON: true})
      .then(function(res){
        if(res.ok == true){
          let data = res.data
          if(data != null){
            that.termSearchResult = data
            // window.console.log(that.termSearchResult)
          }else{
            that.$message("无相似术语")
          }
        }else{
          this.$message.error("查询失败")
        }
      })
    },
    divData(data){
      for(let k in data){
        
      }
    },
    showTermDetail(k){
      let data = this.termSearchResult[k]
      for(let k in data){
        this.termResultParsed.push(divData(data[k]));
      }
    }
  },
  mounted() {}
}
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>