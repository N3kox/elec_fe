<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app width="280">
      <v-divider></v-divider>
      <v-list>
        <v-list-group
          v-for="(item, key) in items"
          :key="key"
          v-model="item.active"
          :append-icon="item.appendIcon"
          @click="itemClick(item,key)"
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item-group v-if="item.children" color="primary" v-model="subItemActive">
            <v-list-item
              v-for="(subItem, k) in item.children"
              :key="k"
              @click="subItemClick(subItem, k)"
            >
              <v-list-item-icon></v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">电力运检知识图谱</span>
      </v-toolbar-title>
      <!-- <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down"
      />-->
      <v-spacer />
      <v-menu offset-y>
        
    </v-menu>
      <!-- <v-btn icon @click="changeTheme">
        <v-icon v-if="!dark">mdi-brightness-7</v-icon>
        <v-icon v-else>mdi-brightness-4</v-icon>
      </v-btn>
      <v-btn icon @click="openTab">
        <v-icon size="28">mdi-github</v-icon>
      </v-btn> -->
      
      <el-button circle icon="el-icon-s-home" type="primary" @click="navigateToMain"></el-button>
      <v-btn icon @click="dialog = true">
        <v-icon size="28">mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title primary-title>Vue D3 Examples</v-card-title>
        <v-card-text>Author: Zhaonan Xu</v-card-text>
        <v-card-text>Email: n3ko@qq.com</v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import packageJson from '../../package.json'
export default {
  data: () => ({
    dialog: false,
    dark: false,
    drawer: null,
    itemActive: 0,
    subItemActive: 0,
    selectedItem: 0,
  }),
  computed: {
    items: function () {
      return [
        {
          icon: 'mdi-graphql',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title1.value'),
          children: [
            { title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title1.value'), path: '/examples/MissionTicketOverview' },
            { title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title2.value'), path: '/examples/DeviceOverview' },
          ],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-home-search-outline',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title2.value'),
          children: [
            { title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title3.value'), path: '/examples/SearchView' },
            { title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title4.value'), path: '/examples/TermSearch' },
            { title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title6.value'), path: '/examples/SolutionSearchView' },
          ],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-file-upload-outline',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title3.value'),
          children: [
            { title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title5.value'), path: '/examples/CsvUpload' },
          ],
          appendIcon: 'mdi-chevron-down'
        },
        // {
        //   icon: 'mdi-alpha-h-box-outline',
        //   title: this.$vuetify.lang.t('$vuetify.sidebar.title2.value'),
        //   children: [
        //     { title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title1.value'), path: '/examples/NodeUpdate' },
        //   ],
        //   appendIcon: 'mdi-chevron-down'
        // }
      ]
    }
  },
  created () {
    this.version = packageJson.version
    if (localStorage.getItem('themeDark') && localStorage.getItem('themeDark') === 'true') {
      this.$vuetify.theme.dark = true
      this.dark = true
    }
    if (this.$route.path === '/examples') {
      this.$router.push('/examples/helloworld').catch(err => { }) // eslint-disable-line
    } else {
      this.$router.push(this.$route.path).catch(err => { }) // eslint-disable-line
      const path = this.$route.path
      this.items.forEach((item, key) => {
        if (item.path === path) {
          this.itemActive = key
        } else {
          if (item.children && item.children.length > 0) {
            item.children.forEach((v, k) => {
              if (v.path === path) {
                sessionStorage.setItem('itemActive', key)
                sessionStorage.setItem('subItemActive', k)
              }
            })
          }
        }
      })

      if (sessionStorage.getItem('itemActive')) {
        this.items[0].active = false
        this.items[Number(sessionStorage.getItem('itemActive'))]['active'] = true
      }

      if (sessionStorage.getItem('subItemActive')) {
        this.subItemActive = Number(sessionStorage.getItem('subItemActive'))
      }
    }
  },
  mounted () {
    if (sessionStorage.getItem('i18nLocale') && sessionStorage.getItem('i18nLocale') === 'zh') {
      this.selectedItem = 1
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('subItemActive')
    sessionStorage.removeItem('itemActive')
  },
  methods: {
    changeLang (lang) {
      this.$i18n.locale = lang
      sessionStorage.setItem('i18nLocale', lang)
      if (sessionStorage.getItem('itemActive')) {
        this.items[0].active = false
        this.items[Number(sessionStorage.getItem('itemActive'))]['active'] = true
        if (sessionStorage.getItem('subItemActive')) {
          this.subItemActive = Number(sessionStorage.getItem('subItemActive'))
        }
      }
    },
    itemClick (item, key) {
      this.subItemActive = null
      sessionStorage.setItem('itemActive', key)
    },
    subItemClick (item, key) {
      sessionStorage.setItem('subItemActive', key)
      this.$router.push(item.path).catch(err => { }) // eslint-disable-line
    },
    goHome () {
      this.$router.push('/Home').catch(err => { }) // eslint-disable-line
    },
    changeTheme () {
      this.dark = !this.dark
      localStorage.setItem('themeDark', String(this.dark))
      this.$vuetify.theme.dark = this.dark
    },
    navigateToMain(){
      this.$router.push('/examples/helloworld').catch(err=>{})
    }
  }
}
</script>
<style scoped>
.img-container {
  display: flex;
  padding: 40px 20px;
}
.logo-img {
  width: 45%;
  object-fit: contain;
  margin: 0 5px;
}
.img-d3-padding {
  padding: 4px !important;
}
</style>
