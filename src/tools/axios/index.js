/* axios 基础配置 */
import Qs from 'qs'
import axios from 'axios'
import wepyAxiosAdapter from 'wepy-plugin-axios/dist/adapter'

const adapter = wepyAxiosAdapter(axios)
const baseURL = 'https://washcar.caryu.com'
// const baseURL = 'https://test.caryu.com'
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

let ajax = axios.create({
  adapter,
  baseURL,
  headers,
  timeout: 12000,
  transformRequest: [data => {
    wx.showLoading({ title: '玩命加载中', mask: !true })
    return Qs.stringify(data)
  }],
  transformResponse: [res => {
    if (res.code !== 0) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: res.msg
      })
    }

    if (typeof res.data === 'string') {
      try {
        res.data = JSON.parse(res.data)
      } catch (error) { }
    }

    return res
  }]
})

// 添加请求拦截器
ajax.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  return config
}, (error) => {
  // 对请求错误做些什么
  wx.hideLoading()
  if (error.response && error.response.status) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: `服务器连接失败, 错误代码(${error.response.status})`
    })
  }
  return Promise.reject(error)
})

// 添加响应拦截器
ajax.interceptors.response.use((response) => {
  // 对响应数据做点什么
  return response
}, (error) => {
  // 对响应错误做点什么
  wx.hideLoading()
  let errMsg = ''
  if (error.response && error.response.status) {
    errMsg = `服务器连接失败, 错误代码(${error.response.status})`
  } else {
    errMsg = String(error)
  }
  wx.showModal({
    title: '提示',
    showCancel: false,
    content: errMsg
  })
  return Promise.reject(error)
})

export default ajax