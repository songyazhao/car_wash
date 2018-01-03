export default [{
  name: 'CarInsurance',
  path: '/CarInsurance',
  component: () => import('@/pages/CarInsurance/CarInsurance'),
  meta: {
    title: '车险办理'
  }
}, {
  name: 'CarInsurance__Select',
  path: '/CarInsurance/CarInsurance__Select',
  component: () => import('@/pages/CarInsurance/CarInsurance__Select'),
  meta: {
    title: '选择险种'
  }
}, {
  name: 'CarInsurance__Result',
  path: '/CarInsurance/CarInsurance__Result',
  component: () => import('@/pages/CarInsurance/CarInsurance__Result'),
  meta: {
    title: '提交成功'
  }
}, {
  name: 'CarInsurance__AddInfo',
  path: '/CarInsurance/CarInsurance__AddInfo',
  component: () => import('@/pages/CarInsurance/CarInsurance__AddInfo'),
  meta: {
    title: '信息完善'
  }
}, {
  name: 'CarInsurance__Flow',
  path: '/CarInsurance/CarInsurance__Flow',
  component: () => import('@/pages/CarInsurance/CarInsurance__Flow'),
  meta: {
    title: '' //核保受理详情
  }
}]