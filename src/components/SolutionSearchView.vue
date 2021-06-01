<template>
  <div class="app">
    <el-input v-model="problemInput" placeholder="请输入查询问题">
      <el-button slot="append" icon="el-icon-search" @click="SolutionInputSubmit" />
    </el-input>
    <div>
      <el-collapse v-model="activeName">
        <el-collapse-item v-for="k, i in solutions" :key="i" :name="i" :title="solutions[i][0]">
          <div>{{solutions[i][1]}}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
    data : ()=>({
        problemInput:'',
        activeName: '1',
        solutions: [],
    }),
    methods:{
        SolutionInputSubmit(){
          let that = this;
          if(this.problemInput == '' || this.problemInput == null){
            this.$message("请输入内容")
            return
          }
          this.$http.post(this.patchUrl(`/source/solution_search`), JSON.stringify(this.problemInput), {emulateJSON : true}).then(function(res){
            if(res.ok == true){
              let data = res.data
              that.solutions = data
            }else{
              that.$message("暂无解决方案")
            }
          })
        }
    },
    mounted(){

    },
}
</script>

<style></style>
