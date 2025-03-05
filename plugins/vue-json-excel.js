// import Vue from 'vue'
// import VueJsonExcel from 'vue-json-excel'

// Vue.use(VueJsonExcel)

import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
const VueJsonExcel = {
  install(Vue, options) {
    Vue.component('downloadExcel', JsonExcel)
  }
}
Vue.use(VueJsonExcel)
export default VueJsonExcel
