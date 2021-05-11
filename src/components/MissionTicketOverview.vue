<template>
  <div id="app">
    <div class="title"></div>
    <svg id="svg" width="1000" height="700" class="container-border"></svg>
    <!-- <d3-network class="d3" ref="net" :net-nodes="nodes" :net-links="links" :options="options" @node-click="nodeClick" @link-click="linkClick" /> -->

    <!-- <el-dialog title="Node Label" :visible.sync="nodeDialogVisible" width="40%" :before-close="handleClose" :modal="false">
      <p v-for="(v, k) in nodeDetail" :key="v">{{ k }}-{{ v }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nodeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->

    <el-drawer title="Node Label" :visible.sync="nodeDialogVisible" width="30%" :modal="false">
      <div class="content-column" v-for="(v, k) in nodeDetail" :key="v.gid">
        <span v-if="notInStopList(k)">{{getAnoName(k)}} : &nbsp;</span>
        <span v-if="notInStopList(k)">{{ v }}</span>
      </div>
      <div class="content-column">
        <el-button type="primary" @click="nodeChangeClick">修 改</el-button>
        <el-button type="primary" @click="nodeDialogVisible = false">关 闭</el-button>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nodeDialogVisible = false">确 定</el-button>
      </span> -->
    </el-drawer>

    <el-dialog title="Link Label" :visible.sync="linkDialogVisible" width="30%" :modal="false">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="linkDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as d3 from 'd3'
export default {
  data: () => ({
    autoIncrementId: 1,
    nodes: [],
    links: [],
    nodeSize: 30,
    canvas: false,
    linksSelected: 'hello',
    propertiesStopList: ['x', 'y', 'fx', 'fy', 'vx', 'vy', '_color', 'routeLocation', 'missionTicketFounder', 'autoId'],
    nodeDialogVisible: false,
    linkDialogVisible: false,
    nodeDetail: {},
    nameMap:{},
  }),
  computed: {
    options() {
      return {
        force: 1600,
        size: { w: 1000, h: 700 },
        nodeSize: this.nodeSize,
        nodeLabels: true,
        linkLabels: true,
        canvas: this.canvas
      }
    }
  },
  methods: {
    notInStopList(name){
      if(name == 'gid') return false;
      else if(name == 'type') return false;
      else if(name == 'index') return false;
      return true;
    },
    getAnoName(name){
      if(this.nameMap[name] != undefined) return this.nameMap[name]
      return name
    },
    handleClose(done) {
      this.nodeDialogVisible = false
      this.linkDialogVisible = false
    },
    getAutoIncrementId() {
      this.autoIncrementId++
      return this.autoIncrementId - 1
    },
    rgbRandom() {
      let a = Math.floor(Math.random() * 255)
      let b = Math.floor(Math.random() * 255)
      let c = Math.floor(Math.random() * 255)
      return 'rgb(' + a + ', ' + b + ', ' + c + ')'
    },
    parseMissionTicketStop(text) {
      let that = this
      let routeLocationMap = new Map()
      let missionTicketFounderMap = new Map()
      let newNodes = []
      let newLinks = []

      let c1 = that.rgbRandom(),
        c2 = that.rgbRandom(),
        c3 = that.rgbRandom(),
        c4 = that.rgbRandom()
      for (let i = 0; i < text.length; i++) {
        text[i].autoId = this.getAutoIncrementId()
        // 修改text[i].name变为unique id
        text[i].name = text[i].gid
        text[i]._color = c1
        text[i].type = 'ticket'
        let routeLocation = text[i].routeLocation[0]
        let missionTicketFounder = text[i].missionTicketFounder[0]
        routeLocation._color = c2
        routeLocation.type = 'route'
        missionTicketFounder._color = c3
        missionTicketFounder.type = 'staff'

        // check routeLocation id
        if (!routeLocationMap.has(routeLocation.name)) {
          routeLocation.autoId = that.getAutoIncrementId()
          routeLocationMap.set(routeLocation.name, routeLocation.id)
          newNodes.push(routeLocation)
        } else {
          routeLocation.id = routeLocationMap.get(routeLocation.name)
        }

        //check missionTicketFounder id
        if (!missionTicketFounderMap.has(missionTicketFounder.name)) {
          missionTicketFounder.autoId = that.getAutoIncrementId()
          missionTicketFounderMap.set(missionTicketFounder.name, missionTicketFounder.id)
          newNodes.push(missionTicketFounder)
        } else {
          missionTicketFounder.id = missionTicketFounderMap.get(missionTicketFounder.name)
        }
        //create links
        let l1 = {
          source: text[i].name,
          target: routeLocation.name,
          name: '站线名称'
        }

        let l2 = {
          source: text[i].name,
          target: missionTicketFounder.name,
          name: '制票人'
        }
        newNodes.push(text[i])
        newLinks.push(l1)
        newLinks.push(l2)
      }
      this.nodes = newNodes
      this.links = newLinks
    },

    nodeClick(node) {
      let nd = {}
      for (let k in node) {
        if (this.propertiesStopList.indexOf(k) == -1) {
          nd[k] = node[k] != null ? node[k] : 'NULL'
        }
      }
      this.nodeDetail = nd
      this.nodeDialogVisible = true
      //   if (node.type == 'ticket') window.console.log(node.descSummary)
      //   else window.console.log(node.name)
    },
    linkClick(link) {
      this.linkDialogVisible = true
    },

    nodeChangeClick() {
      let that = this
      this.$router.push({
        path: '/examples/NodeUpdate',
        name: 'NodeUpdate',
        params: {
          node: that.nodeDetail
        }
      })
    },

    graphDraw() {
      let that = this
      let svg = d3.select('svg')
      let width = +svg.attr('width')
      let height = +svg.attr('height')
      let radius = 20

      // set up the simulation and add forces
      let simulation = d3.forceSimulation().nodes(this.nodes)
      let linkForce = d3.forceLink(this.links).id(function(d) {
        return d.name
      })

      let chargeForce = d3.forceManyBody().strength(-150)
      let centerForce = d3.forceCenter(width / 2, height / 2)

      simulation
        .force('chargeForce', chargeForce)
        .force('centerForce', centerForce)
        .force('links', linkForce)

      // add tick instructions:
      simulation.on('tick', tickActions)

      // add encompassing group for the zoom
      let g = svg.append('g').attr('class', 'everything')

      // draw lines for the links
      let link = g
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.links)
        .enter()
        .append('line')
        .attr('stroke-width', 2)
        .style('stroke', linkColour)
        .on('click', this.linkClick)

      // draw circles for the nodes
      let node = g
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', radius)
        .attr('fill', circleColour)
        .on('click', this.nodeClick)

      let labelNode = g
        .append('g')
        .attr('class', 'labelNodes')
        .selectAll('text')
        .data(this.nodes)
        .enter()
        .append('text')
        .text(function(d) {
          if (d.type == 'ticket') return d.descSummary
          return d.name
        })
        .style('fill', '#555')
        .style('font-family', 'Arial')
        .style('font-size', 16)
        .style('pointer-events', 'none')

      let dragHandler = d3
        .drag()
        .on('start', dragStart)
        .on('drag', dragDrag)
        .on('end', dragEnd)

      dragHandler(node)

      // add zoom capabilities
      let zoomHandler = d3.zoom().on('zoom', zoomActions)

      zoomHandler(svg)

      /** Functions **/

      function circleColour(d) {
        if (d.type == 'ticket') return 'red'
        else if (d.type == 'staff') return 'green'
        return 'blue'
      }

      function linkColour(d) {
        return 'black'
      }

      // Drag functions
      // d is the node
      function dragStart(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      // make sure you can't drag the circle outside the box
      function dragDrag(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragEnd(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      // Zoom functions
      function zoomActions() {
        g.attr('transform', d3.event.transform)
      }

      function tickActions() {
        // update circle positions each tick of the simulation
        node
          .attr('cx', function(d) {
            return d.x
          })
          .attr('cy', function(d) {
            return d.y
          })

        // update link positions
        link
          .attr('x1', function(d) {
            return d.source.x
          })
          .attr('y1', function(d) {
            return d.source.y
          })
          .attr('x2', function(d) {
            return d.target.x
          })
          .attr('y2', function(d) {
            return d.target.y
          })
        labelNode.call(updateNode)
      }
      function updateNode(node) {
        node.attr('transform', function(d) {
          return 'translate(' + fixna(d.x) + ',' + fixna(d.y) + ')'
        })
      }
      function fixna(x) {
        if (isFinite(x)) return x - 20
        return 0
      }
    }
  },
  mounted() {
    let that = this
    this.nameMap = this.getNameMap();
    if (this.$route.params.data == undefined) {
      new Promise((resolve, reject) => {
        that.$http.get(this.patchUrl(`/mission_ticket/all`)).then((response) => {
          if (response.data == null || response.ok == false) {
            that.$message.error('Error')
          } else {
            that.parseMissionTicketStop(JSON.parse(response.bodyText))
            that.graphDraw()
          }
        })
      })
    }else{
      this.$message.success("查询成功")
      let data = this.$route.params.data
      that.parseMissionTicketStop(data)
      that.graphDraw()
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Courier New', Courier, monospace;
  background-color: rgb(231, 23, 23);
}
.title {
  position: absolute;
  text-align: center;
  left: 2em;
}
h1,
a {
  color: #1aad8d;
  text-decoration: none;
}

ul.menu {
  list-style: none;
  position: absolute;
  z-index: 100;
  min-width: 20em;
  text-align: left;
}

ul.menu li {
  margin-top: 1em;
  position: relative;
}
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

.properties_list {
  float: left;
}

.content-column {
  opacity: 0.65;
  box-sizing: content-box;
  margin-left: 20px;
  padding: 3px;
}
.content-title {
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, sans-serif;
  font-weight: 400;
  color: black;
  float: left;
  opacity: 0.7;
}

.content-words {
  text-align: left;
  font-size: 16px;
  font-family: DIN-Regular, sans-serif;
  font-weight: 400;
  color: black;
  opacity: 0.7;
}
.content-unit {
  margin-left: 5px;
  color: #9a9a9a;
}
</style>
