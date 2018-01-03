/* Vuex state */
export default {
  host_name: 'https://washcar.caryu.com/',
  isAndroid: navigator.userAgent.match(/android/i),
  isIOS: navigator.userAgent.match(/(iPhone|iPod|iPad);?/i),
  clientH: document.body.clientHeight,
  source: '2', //信息来源 1:APP 2:微信公众号
  openid: 0, //微信的用户ID
  open_city: { //当前开通城市{128:唐山, 1326:厦门, 2:北京},空数组时表示全部
    CarLoan: [],
    CarUsed: [],
    CarInsurance: []
  },
  license_number: '', //车牌号
  city_list: [], //城市数据
}