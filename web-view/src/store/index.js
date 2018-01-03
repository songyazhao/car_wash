import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './state'
import mutations from './mutations'
import actions from './actions'
import CarLoanData from './modules/CarLoan'
import CarUsedData from './modules/CarUsed'
import CarInsuranceData from './modules/CarInsurance'
import VuxLoading from './modules/VuxLoading'

/**
 * 注册Vuex
 */
export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    CarLoanData,       // 车贷页的 表单数据
    CarUsedData,       // 二手车页的 表单数据
    CarInsuranceData,  // 车险页
    VuxLoading         // 每个页的loading
  }
})