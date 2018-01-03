/* axios 基础配置 */
import axios from 'axios'
import Qs from 'qs'

const $axios = axios.create({
  // baseURL: 'https://washcar.caryu.com',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 12000,
  transformRequest: [data => Qs.stringify(data)],
  // transformResponse: [res => {
  //   if (res.code !== 0) { }
  //   return res
  // }]
})

export default {
  install(Vue) {
    Vue.prototype.$http = $axios
    Vue.http = $axios
  },
  $http: $axios
}

export const $http = $axios
