<template>
  <div>
    <h3>电力运检领域知识图谱</h3>
    <h5>标签功能:</h5>
    <el-tree
      class="filter-tree"
      :data="illu"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree">
    </el-tree>
    <h5>图介绍:</h5>
    <el-tree
      class="filter-tree"
      :data="graphIllu"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree">
    </el-tree>
  </div>
</template>
<script>
export default {
  data: ()=>({
    graphIllu:[
      {
        id: 1,
        label: 'd3.js图谱可视化,允许拖拽/缩放'
      },{
        id: 2,
        label: '详细功能',
        children:[{
          id: 3,
          label: '节点点击: 显示节点详细信息'
        },{
          id: 4,
          label: '修改: 修改节点属性值'
        },{
          id: 5,
          label: '历史: 查看节点更新记录'
        }]
      }
    ],
    illu:[{
      id: 1,
      label: '总览',
      children:[{
        id: 4,
        label: '工单总览: 展示部分工单信息',
      },{
        id: 5,
        label: '设备总览: 展示部分设备信息',
      }]
    },{
      id: 2,
      label: '检索',
      children:[{
        id: 6,
        label: '定向搜索: 根据查询属性精准匹配所有子图',
      },{
        id: 7,
        label: '术语搜索: 检索文字中出现的相关电力运检术语',
      },{
        id: 8,
        label: '方案查询: 检索相似运检处理方案',
      }]
    },{
      id: 3,
      label: '上传',
      children:[{
        id: 9,
        label: '数据上传：上传运检数据至服务器'
      }]
    }]
  }),
  mounted () {
    // let p = d3.select('body')
    //   .selectAll('p')
    // p.text('Hello World')
  }
}
</script>
<style>
</style>
