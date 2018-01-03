/**
 * Vuex actions
 * 供vue页面的使用的async methods
 * 调用方式: $store.dispatch(MethodName, [arg])
 */

export default {
  getIds({ commit }) {               // 获取shop_id, openid, print_id...
    commit('GET_IDS')
  },
  getCityList({ commit }) {          // 获取当前开通的城市列表
    commit('GET_CITY_LIST')
  },
  getUserCity({ commit }) {  // 用openid换取用户关注公众号时 所关联的门店所在的城市ID
    commit('GET_USER_CITY')
  }
}