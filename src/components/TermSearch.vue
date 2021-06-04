<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-aside width="50%">
        <el-col :span="10" style="margin-left: 15%">
          术语搜索
          <el-input v-model="termInput" placeholder="请输入术语内容">
            <el-button slot="append" icon="el-icon-search" @click="termInputSubmit" :loading="clicked" />
          </el-input>
        </el-col>
        <el-col :span="2">
          <div v-for="(v, i) in termSearchResult" :key="i">
            <el-button @click="showTermDetail(i)">{{ v[0] }}</el-button>
          </div>
        </el-col>
      </el-aside>
      <el-main>
        <div class="tree">
          <el-tree :data="termResultParsed" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    termInput: '',
    termSearchResult: {},
    termResultParsed: [],
    termDetailSave: {},
    clicked: false
  }),
  methods: {
    termInputSubmit() {
      let that = this
      if (this.termInput == '') {
        this.$message('请输入内容')
        return
      }
      this.clicked = true
      this.$http.post(this.patchUrl('/source/term_search'), JSON.stringify(this.termInput), { emulateJSON: true }).then(function (res) {
        if (res.ok == true) {
          let data = res.data
          // window.console.log(res)
          if (data != null) {
            that.termSearchResult = data
          } else {
            that.$message('无相似术语')
          }
        } else {
          that.$message.error('查询失败')
        }
        that.clicked = false
      })
    },
    divData(key, data) {
      // window.console.log(key)
      // window.console.log(data)
      let res = {}
      res.label = key
      res.children = []
      for (let row in data) {
        res.children.push({ label: data[row] })
      }
      return res
    },
    showTermDetail(i) {
      let k = this.termSearchResult[i][0]
      let that = this
      if (this.termDetailSave[k] != undefined) {
        this.termResultParsed = this.termDetailSave[k]
        return
      }
      this.$http.post(this.patchUrl(`/source/term_search_exact`), JSON.stringify(k), { emulateJSON: true }).then(function (res) {
        if (res.ok == true) {
          let data = res.data
          let temp = []
          for (let kk in data) {
            temp.push(this.divData(kk, data[kk]))
          }
          that.termResultParsed = temp
          that.termDetailSave[k] = temp
          that.$message.sucess("查询结果返回")
          
        } else {
          that.$message('无检索结果')
        }
      })
    },
    handleNodeClick(data) {
      // console.log(data);
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
  line-height: 100px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
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

.tree {
  height: 100%;
}

.el-tree-node {
  white-space: normal;
  height: 100%;
}
.el-tree-node__content {
  height: 100%;
  /* align-items: start; */
}

/* .el-tree {
  overflow: scroll;
  display: inline-block !important;
  min-width: 100%;
}

.el-tree>.el-tree-node {
  display: inline-block !important;
  min-width: 100%;
} */
</style>
