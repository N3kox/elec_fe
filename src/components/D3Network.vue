<template>
  <div id="app">
    <div class="title">
      <ul class="menu">
        <li>
          <label> Node size </label>
          <input type="range" min="1" max="100" v-model="nodeSize" /> {{ options.nodeSize }}
        </li>
      </ul>
    </div>
    <d3-network class="d3" ref="net" :net-nodes="nodes" :net-links="links" :options="options" @node-click="nodeClick"/>
  </div>
</template>
<script>
import D3Network from 'vue-d3-network'
export default {
  data: () => ({
    autoIncrementId : 1,
    nodes: [],
    links: [],
    nodeSize: 30,
    canvas: false,
    linksSelected: 'hello',
    propertiesStopList: ['x', 'y', 'fx', 'fy', 'vx', 'vy', '_color']
  }),
  components: {
    D3Network
  },
  computed: {
    options() {
      return {
        force: 1600,
        size: { w: 1000, h: 800 },
        nodeSize: this.nodeSize,
        nodeLabels: true,
        linkLabels: true,
        canvas: this.canvas
      }
    }
  },
  methods: {
    getAutoIncrementId(){
      this.autoIncrementId++
      return this.autoIncrementId - 1
    },
    rgbRandom(){
      let a = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      let c = Math.floor(Math.random() * 255);
      return 'rgb(' + a + ', ' + b + ', ' + c + ')'
    },
    parseMissionTicketStop(text) {
      let that = this
      let routeLocationMap = new Map()
      let missionTicketFounderMap = new Map()
      let newNodes = []
      let newLinks = []
      
      let c1 = that.rgbRandom(), c2 = that.rgbRandom(), c3 = that.rgbRandom(), c4 = that.rgbRandom()
      for (let i = 0; i < text.length; i++) {
        text[i].id = this.getAutoIncrementId()
        text[i].name = text[i].descSummary
        text[i]._color = c1
        text[i].type = 'ticket'
        let routeLocation = text[i].routeLocation[0]
        let missionTicketFounder = text[i].missionTicketFounder[0]
        routeLocation._color = c2
        routeLocation.type = 'company'
        missionTicketFounder._color = c3
        missionTicketFounder.type = 'staff'
        // check routeLocation id
        if(!routeLocationMap.has(routeLocation.name)){
          routeLocation.id = that.getAutoIncrementId()
          routeLocationMap.set(routeLocation.name, routeLocation.id)
          newNodes.push(routeLocation)
        }else{
          routeLocation.id = routeLocationMap.get(routeLocation.name)
        }
        
        //check missionTicketFounder id
        if(!missionTicketFounderMap.has(missionTicketFounder.name)){
          missionTicketFounder.id = that.getAutoIncrementId()
          missionTicketFounderMap.set(missionTicketFounder.name, missionTicketFounder.id)
          newNodes.push(missionTicketFounder)
        }else{
          missionTicketFounder.id = missionTicketFounderMap.get(missionTicketFounder.name)
        }
        //create links
        let l1 = {
          sid : text[i].id,
          tid : routeLocation.id,
          _color : c4,
          _svgAttrs: { 'stroke-width': 1, opacity: 1 }, 
          name: '站线名称'
        }

        let l2 = {
          sid : text[i].id,
          tid : missionTicketFounder.id,
          _color : c4,
          _svgAttrs: { 'stroke-width': 1, opacity: 1 }, 
          name: '制票人' 
        }

        newNodes.push(text[i])
        newLinks.push(l1)
        newLinks.push(l2)
      }
      this.nodes = newNodes
      this.links = newLinks
    },
    nodeClick(event, node){
      for(let key in node){
        if(this.propertiesStopList.indexOf(key) == -1)
          window.console.log(key)
      }
    }
  },
  mounted() {
    let that = this
    new Promise((resolve, reject) => {
      that.$http.get(this.patchUrl(`/mission_ticket/stop?val=true`)).then((response) => {
        if ((response.data = null || response.ok == false)) {
          that.$message.error('Error')
        } else {
          that.parseMissionTicketStop(JSON.parse(response.bodyText))
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
*{  
	  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/   
	  -webkit-user-select:none; /*webkit浏览器*/   
	  -khtml-user-select:none; /*早期浏览器*/   
	  -moz-user-select:none;/*火狐*/   
	  -ms-user-select:none; /*IE10*/   
	  user-select:none;   
}
</style>
