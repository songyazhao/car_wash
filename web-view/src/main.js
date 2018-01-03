import Vue from 'vue';
import FastClick from 'fastclick';
import App from './App'
import router from './router' //引入页面路由
import store from './store'
import { ToastPlugin, ConfirmPlugin } from 'vux'
import AjaxPlugin from '@/utils/fetch.js'
import { getSign, isEmptyObject } from '@/utils'
// import  { WechatPlugin } from 'vux'

Vue.use(ToastPlugin) //Toast
Vue.use(AjaxPlugin) //Ajax
Vue.use(ConfirmPlugin) //ConfirmPlugin
// Vue.use(WechatPlugin) //微信JSSDK

Vue.prototype.getSign = getSign
Vue.prototype.isEmptyObject = isEmptyObject
Vue.prototype.toastFail = (text = "返回错误", w = 11) =>
  Vue.$vux.toast.show({
    text,
    type: 'text',
    isShowMask: true,
    position: 'middle',
    width: w + 'em'
  })

FastClick.attach(document.body)

/**
 * 日志输出开关
 */
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
