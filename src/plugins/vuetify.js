// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import colors from 'vuetify/lib/util/colors'
import VueI18n from 'vue-i18n'

Vue.use(Vuetify)
Vue.use(VueI18n)

const messages = {
  en: {
    $vuetify: {
      examplesButton: 'Enter',
      sidebar: {
        title1: {
          value: '总览',
          children: {
            title1: {
              value: '工单总览'
            },
            title2: {
              value: '设备总览'
            },
            title3: {
              value: '定向搜索'
            },
            title4: {
              value: '术语搜索'
            },
            title5: {
              value: '数据上传'
            },
            title6: {
              value: '方案查询'
            }
          }
        },
        // title2: {
        //   value: '信息更新',
        //   children: {
        //     title1:{
        //       value: 'NodeUpdate'
        //     },
        //   }
        // }
      }
    }
  },
  zh: {
    $vuetify: {
      examplesButton: '进入',
      sidebar: {
        
      }
    }
  }
}

let i18nLocale = 'en'

if (sessionStorage.getItem('i18nLocale')) {
  i18nLocale = sessionStorage.getItem('i18nLocale')
}

const i18n = new VueI18n({
  locale: i18nLocale,
  messages
})

const opts = {
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#409eff',
        secondary: '#54a8ff',
        accent: '#9c27b0',
        error: '#f44336',
        warning: '#ff5722',
        info: '#607d8b',
        success: '#4caf50'
      },
      dark: {
        primary: colors.blue.darken1
      }
    }
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
}

const vuetify = new Vuetify(opts)
export { vuetify, i18n }
