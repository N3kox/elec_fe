<template>
  <div class="main justify-center">
    <div class="flex-column margin-top-15vh">
      <div class="d-flex justify-center">
        <img src="../assets/img/vue.png" class="d-flex img-width" />
        <img src="../assets/img/d3.svg" class="d-flex img-width img-d3-padding" />
        <img src="../assets/img/neo.webp" class="d-flex img-width" />
      </div>
      <h4 class="display-3 font-weight-regular span-margin">电力领域知识图谱demo</h4>
      <div>
        <v-btn outlined large rounded color="primary" class="margin-0-15 z-index-2" @click="routerRedirect"><v-icon left>mdi-palm-tree</v-icon>{{ $vuetify.lang.t('$vuetify.examplesButton') }}</v-btn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      dark: false
    }
  },
  created() {
    if (localStorage.getItem('themeDark') && localStorage.getItem('themeDark') === 'true') {
      this.$vuetify.theme.dark = true
      this.dark = true
    }
  },
  methods: {
    routerRedirect() {
      this.$router.push('/examples').catch((err) => {}) // eslint-disable-line
    }
  }
}
</script>
<style scoped>
.main {
  text-align: center;
}
.margin-top-15vh {
  margin-top: 15vh;
}

.img-width {
  width: 12% !important;
  margin: 0 35px;
}

.img-d3-padding {
  padding: 10px;
}

.span-margin {
  margin: 20px 0 40px 0;
}

.margin-0-15 {
  margin: 0 15px;
}

.z-index-2 {
  z-index: 2;
}
</style>
