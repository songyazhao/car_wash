export default [{
  name: 'CarLoan',
  path: '/CarLoan',
  component: () => import('@/pages/CarLoan/CarLoan'),
  meta: {
    title: '汽车贷款'
  }
}, {
  name: 'CarLoan__Orders',
  path: '/CarLoan/CarLoan__Orders',
  component: () => import('@/pages/CarLoan/CarLoan__Orders'),
  meta: {
    title: '车抵贷订单'
  }
}]