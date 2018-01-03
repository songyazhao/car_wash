export default [{
  name: 'CarUsed',
  path: '/CarUsed',
  component: () => import('@/pages/CarUsed/CarUsed'),
  meta: {
    title: '我要卖车'
  }
}, {
  name: 'CarUsed__Result',
  path: '/CarUsed/CarUsed__Result',
  component: () => import('@/pages/CarUsed/CarUsed__Result'),
  meta: {
    title: '提交成功'
  }
}, {
  name: 'CarUsed__Orders',
  path: '/CarUsed/CarUsed__Orders',
  component: () => import('@/pages/CarUsed/CarUsed__Orders'),
  meta: {
    title: '二手车订单'
  }
}]