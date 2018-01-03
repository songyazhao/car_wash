import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

import Home from './modules/Home'
import CarLoan from './modules/CarLoan'
import CarUsed from './modules/CarUsed'
import CarViolation from './modules/CarViolation'
import CarInsurance from './modules/CarInsurance'
import BeijingLicenseNumber from './modules/BeijingLicenseNumber'
import CarBrand from './modules/CarBrand'
import AboutUs from './modules/AboutUs'
import CarManage from './modules/CarManage'

const routes = [
	...Home, //主页
	...CarLoan, //车抵贷
	...CarUsed, //二手车
	...CarViolation, //车违章
	...CarInsurance, //车险
	...BeijingLicenseNumber, //京牌过户
	...CarBrand, //车型选择
	...AboutUs, //关于我们
	...CarManage //车辆管理
]

/**
 * 注册路由
 */
const router = new VueRouter({
  routes,
  scrollBehavior: (to, from, savedPosition) => ({ y: 0 })
})


/*
 * 页面切换显示loading,以及title的改变
 */
router.beforeEach((to, from, next) => {
	// const reg = /(\b(Home|AboutUs|CarManage)\b)|(__Orders)\b/
	// if (store.state.isIOS || to.name.match(reg)) { document.title = to.meta.title }
	document.title = to.meta.title

	if (to.name.match(/\b(CarLoan|CarUsed)\b/)) {
		let key = to.name + 'Data'
		store.state[key].openid = store.state.openid
		store.state[key].source = store.state.source
	}
	store.commit('updateLoading', true)
	next()
})
router.afterEach(to => { // 页面间切换 650毫秒过渡
	setTimeout(() => store.commit('updateLoading', false), 650)
})

export default router
