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
      <div class="content-column" v-for="(v, k) in nodeDetail">
        <span>{{ k }}：</span>
        <span>{{ v }}</span>
      </div>
      <div class="content-column">
        <el-button type="primary" @click="nodeChangeClick">修 改</el-button>
        <el-button type="primary" @click="nodeDialogVisible = false">关 闭</el-button>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nodeDialogVisible = false">确 定</el-button>
      </span> -->
    </el-drawer>

    <el-dialog title="Link Label" :visible.sync="linkDialogVisible" width="30%" :modal="false" >
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
    fullMap: new Map(),

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
    objectIsEmpty(obj){
      for(let k in obj)
        return false
      return true;
    },
    parseMissionTicketStop(text) {
      // window.console.log(text)
      let that = this
      let idMap = new Map()
      let idSet = new Set()
      let newNodes = []
      let newLinks = []

      for (let i = 0; i < text.length; i++) {
        let item = text[i];
        let deviceName = item.name
        let device = {}
        device.type = 'device'
        for(let k in item){
          if(typeof(item[k]) == 'string'){
            device[k] = item[k]
            continue;
          }
          let ce = item[k][0]
          if(this.objectIsEmpty(ce)) continue;
          switch(k){
            case 'companyEntities':{
              let company = {}
              company.type = 'company'
              company.id = ce.gid
              company.gid = ce.gid
              company.name = ce.name
              newLinks.push({
                source : deviceName,
                target : company.name,
                name : '维护公司'
              })
              if(idSet.has(company.id) == false)
                newNodes.push(company)
              idSet.add(ce.gid)
              idMap.set(company.gid, company)
              break;
            }
            case 'classEntities':{
              let classEntity = this.deepCopy(ce)
              classEntity.type = 'class'
              classEntity.id = ce.gid
              classEntity.name = ce.className
              newLinks.push({
                source : deviceName,
                target : classEntity.name,
                name : '维护班组'
              })
              if(idSet.has(classEntity.id) == false)
                newNodes.push(classEntity)
              idSet.add(ce.gid)
              idMap.set(classEntity.gid, classEntity)
              break;
            }
            case 'deviceTypeCodeEntities':{
              let deviceTypeCode = this.deepCopy(ce)
              deviceTypeCode.type = "deviceType"
              deviceTypeCode.id = ce.gid
              deviceTypeCode.name = ce.typeCode
              newLinks.push({
                source : deviceName,
                target : deviceTypeCode.name,
                name : '设备编号'
              })
              if(idSet.has(deviceTypeCode.id) == false)
                newNodes.push(deviceTypeCode)
              idSet.add(ce.gid)
              idMap.set(deviceTypeCode.gid, deviceTypeCode)
              break;
            }
            case 'countryEntities':{
              let country = this.deepCopy(ce)
              country.type = "country"
              country.id = ce.gid
              newLinks.push({
                source : deviceName,
                target : country.name,
                name : '生产国家'
              })
              if(idSet.has(country.id) == false)
                newNodes.push(country)
              idSet.add(ce.gid)
              idMap.set(country.gid, country)
              break;
            }
            case 'deviceTypeEntities':{
              let deviceType = this.deepCopy(ce)
              deviceType.type = "deviceType"
              deviceType.id = ce.gid
              deviceType.name = ce.deviceTypeName
              newLinks.push({
                source : deviceName,
                target : deviceType.name,
                name : '设备类型'
              })
              if(idSet.has(deviceType.id) == false)
                newNodes.push(deviceType)
              idSet.add(ce.gid)
              idMap.set(deviceType.gid, deviceType)
              break;
            }
            case 'routeLocationEntities':{
              let routeLocation = this.deepCopy(ce)
              routeLocation.type = "routeLocation"
              routeLocation.id = ce.gid
              routeLocation.name = ce.name
              newLinks.push({
                source : deviceName,
                target : routeLocation.name,
                name : '线路名称'
              })
              if(idSet.has(routeLocation.id) == false)
                newNodes.push(routeLocation)
              idSet.add(ce.gid)
              idMap.set(routeLocation.gid, routeLocation)
              break;
            }
            case 'deviceManufactorEntities':{
              let deviceManufactor = this.deepCopy(ce)
              deviceManufactor.type = "deviceManufactor"
              deviceManufactor.id = ce.gid
              newLinks.push({
                source : deviceName,
                target : deviceManufactor.name,
                name : '设备制造商'
              })
              if(idSet.has(deviceManufactor.id) == false)
                newNodes.push(deviceManufactor)
              idSet.add(ce.gid)
              idMap.set(deviceManufactor.gid, deviceManufactor)
              break;
            }
            case 'staffEntities':{
              // window.conosle.log(item[k])
              for(let st in item[k]){
                // window.console.log(item[k][st])
                let staff = this.deepCopy(item[k][st])
                staff.id = st.gid
                staff.name = st.name
                newLinks.push({
                  source : deviceName,
                  target : staff.name,
                  name : '设备制造商'
                })
                if(idSet.has(staff.id) == false)
                  newNodes.push(staff)
                // newNodes.push(staff)
                idSet.add(st.gid)
                idMap.set(staff.gid, staff)
              }
              break;
            }
          }
        }
        newNodes.unshift(device);
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

    nodeChangeClick(){
      let that = this
      this.$router.push({
        path: '/examples/NodeUpdate',
        name: 'NodeUpdate',
        params: {
          node : that.nodeDetail
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
      let linkForce = d3.forceLink(this.links).id(function (d) {
        return d.name
      })

      let chargeForce = d3.forceManyBody().strength(-300)
      let centerForce = d3.forceCenter(width / 2, height / 2)

      simulation.force('chargeForce', chargeForce).force('centerForce', centerForce).force('links', linkForce)

      // add tick instructions:
      simulation.on('tick', tickActions)

      // add encompassing group for the zoom
      let g = svg.append('g').attr('class', 'everything')

      // draw lines for the links
      let link = g.append('g').attr('class', 'links').selectAll('line').data(this.links).enter().append('line').attr('stroke-width', 2).style('stroke', linkColour).on('click', this.linkClick)

      // draw circles for the nodes
      let node = g.append('g').attr('class', 'nodes').selectAll('circle').data(this.nodes).enter().append('circle').attr('r', radius).attr('fill', circleColour).on('click', this.nodeClick)

      let labelNode = g
        .append('g')
        .attr('class', 'labelNodes')
        .selectAll('text')
        .data(this.nodes)
        .enter()
        .append('text')
        .text(function (d) {
          if (d.type == 'ticket') return d.descSummary
          return d.name
        })
        .style('fill', '#555')
        .style('font-family', 'Arial')
        .style('font-size', 16)
        .style('pointer-events', 'none')

      let dragHandler = d3.drag().on('start', dragStart).on('drag', dragDrag).on('end', dragEnd)

      dragHandler(node)

      // add zoom capabilities
      let zoomHandler = d3.zoom().on('zoom', zoomActions)

      zoomHandler(svg)

      /** Functions **/

      function circleColour(d) {
        switch(d.type){
          case 'device':
            return '#FAEBD7'
          case 'staff':
            return '#FF7F50'
          case 'class':
            return '#6495ED'
          case 'deviceType':
            return '#6495ED'
          case 'deviceCode':
            return '#9932CC'
          case 'deviceManufactor':
            return '#8FBC8F'
          case 'routeLocation':
            return '#FFD700'
        }
        return '#E6E6FA'
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
          .attr('cx', function (d) {
            return d.x
          })
          .attr('cy', function (d) {
            return d.y
          })

        // update link positions
        link
          .attr('x1', function (d) {
            return d.source.x
          })
          .attr('y1', function (d) {
            return d.source.y
          })
          .attr('x2', function (d) {
            return d.target.x
          })
          .attr('y2', function (d) {
            return d.target.y
          })
        labelNode.call(updateNode)
      }
      function updateNode(node) {
        node.attr('transform', function (d) {
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
    new Promise((resolve, reject) => {
      that.$http.get(this.patchUrl(`/device/all`)).then((response) => {
        if ((response.data = null || response.ok == false)) {
          that.$message.error('Error')
        } else {
          that.parseMissionTicketStop(JSON.parse(response.bodyText))
          that.graphDraw()
        }
      })
    })
  }
}
</script>

<style>
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
  opacity: 0.7;;
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


.el-drawer.rtl{
    overflow: scroll;
}

</style>