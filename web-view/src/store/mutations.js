import Vue from 'vue'
import { querystring } from 'vux'

/**
 * Vuex mutations
 * 供vue页面的使用的methods
 * 调用方式: $store.commit(MethodName, [arg])
 */
export default {
  GET_IDS(state) {
    let params = querystring.parse(decodeURI(location.search))
    state.openid = params.openid || 0

    // const arr = ['CarLoanData', 'CarUsedData']
    // arr.forEach((v, i) => {
    //   state[v].city = params.city || ''
    //   state[v].city_id = params.city_id ? params.city_id.split(',') : []

    //   /* 车主名字和上牌时间 这次让去掉了不保证后期会不会再加上 所以先注释 */
    //   // state[v].name = params.name||''
    //   // state[v][i==0 ? 'buy_time' : 'card_time'] = params.buy_time
    // })
  },
  GET_CITY_LIST(state) {
    state.city_list = [{ "name": "北京", "value": "1" }, { "name": "河北省", "value": "102" }, { "name": "福建省", "value": "1310" }, { "name": "北京市", "value": "2", "parent": "1" }, { "name": "石家庄市", "value": "103", "parent": "102" }, { "name": "唐山市", "value": "128", "parent": "102" }, { "name": "厦门市", "value": "1326", "parent": "1310" }]
    // Vue.http.post('/index.php/Xiaochengxu/Loans/getCityList')
    //   .then((res) => {
    //     res = res.data
    //     if (res.code == 0)
    //       state.city_list = res.data
    //     else
    //       console.info('VUEX__mutations(GET_CITY_LIST)请求返回错误', res)
    //   })
    //   .catch(err => {
    //     console.info('VUEX__mutations(GET_CITY_LIST)执行失败', err)
    //   })
  }
}