<template>
  <div id="app">
    <el-container style="height: 100%">
        <div>
      <h3 style="margin:30px">{{type}}更新Log</h3>
      <h4 style="margin:30px" v-if="logs.length == 0">暂无更新记录</h4>
      <el-timeline style="margin:30px">
        <el-timeline-item v-for="(k, i) in logs" :key="i" :timestamp="k[0]" placement="top">
          <el-card>
            <div v-for="(item, j) in k[1]" :key="j">
              <h4>更新 {{ nameMap[item.propertyName] }} : 从 {{ item.from }} 至 {{ item.to }}</h4>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
        </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    id: '',
    type: '',
    cur: '',
    logs: [],
    nameMap: null,
  }),
  methods: {
    // TODO: 按property筛选
    parseLog(data) {
      let that = this
      let map = new Map()
      let endTime = '9999/99/99 99:99:99'
      // 构建时间轴上节点
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let propertyName = ''
        let originTime = ''
        let parsedTime = ''
        //以时间为key做map
        for (let k in item) {
          if (k == 'update_time_stamp') {
            originTime = item[k]
            parsedTime = this.parseTime(item[k])
            continue
          }
          propertyName = k
        }
        if (map.has(parsedTime) == false) {
          map.set(parsedTime, [])
        }
        let ins = {
          originTime: this.parseTime(originTime),
          propertyName: propertyName,
          from: item[propertyName]
        }
        let tmp = map.get(parsedTime)
        tmp.push(ins)
        map.set(parsedTime, tmp)
      }
      // 添加结尾
      let end = []
      for (let key in this.cur) {
        let ins = {
          originTime: endTime,
          propertyName: key,
          from: this.cur[key]
        }
        end.push(ins)
      }
      map.set(endTime, end)
      // sort
      var arr = Array.from(map)
      arr.sort(function(a, b) {
        return that.cmpTime(a[0], b[0])
      })
      // link
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i][1].length; j++) {
          let pname = arr[i][1][j].propertyName
          let to = ''
          let found = false
          for (let k = i + 1; k < arr.length; k++) {
            if (found) break
            for (let m = 0; m < arr[k][1].length; m++) {
              if (arr[k][1][m].propertyName == pname) {
                to = arr[k][1][m].from
                found = true
                break
              }
            }
          }
          arr[i][1][j].to = to
        }
      }
      this.logs = arr.slice(0, arr.length - 1)
    },
    parseDate(cur) {
      let a = cur.split('_')
      let b = a[0].split('-').join('/')
      return b
    },
    parseTime(cur) {
      let a = cur.split('_')
      let b = a[0].split('-').join('/') + ' ' + a[1].split('-').join(':')
      return b
    },
    cmpTime(a, b) {
      let aa = a.split(' '),
        bb = b.split(' ')
      let da = aa[0].split('/'),
        db = bb[0].split('/')
      let ta = aa[1].split(':'),
        tb = bb[1].split(':')
      for (let i = 0; i < da.length; i++) {
        if (da[0] > db[0]) return 1
        else if (da[1] < db[1]) return -1
        else continue
      }
      for (let i = 0; i < ta.length; i++) {
        if (ta[0] > tb[0]) return 1
        else if (ta[1] < tb[1]) return -1
        else continue
      }
      return 0
    }
  },
  mounted() {
    let that = this
    this.nameMap = this.getNameMap()
    if (this.$route.params.type != undefined) {
      this.cur = this.$route.params.node
      this.type = this.$route.params.type
      this.id = this.$route.params.node.gid
      new Promise((resolve, reject) => {
        that.$http.post(this.patchUrl(`/source/log?id=${this.id}`)).then((response) => {
          if ((response.data = null || response.ok == false)) {
            that.$message.error('Error')
          } else {
            that.parseLog(JSON.parse(response.bodyText))
          }
        })
      })
    }
  }
}
</script>

<style scoped>
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

.el-tree {
  overflow: scroll;
  display: inline-block !important;
  min-width: 100%;
}

.el-tree > .el-tree-node {
  display: inline-block !important;
  min-width: 100%;
}
</style>
