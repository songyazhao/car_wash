export default [{
  name: 'CarManage',
  path: '/CarManage',
  component: () => import('@/pages/CarManage/CarManage'),
  meta: {
    title: '车辆管理'
  }
},{
  name: 'CarManage__EditCar',
  path: '/CarManage/CarManage__EditCar',
  component: () => import('@/pages/CarManage/CarManage__EditCar'),
  meta: {
    title: '添加车辆'
  }
},{
  name: 'CarManage__ToShopRecord',
  path: '/CarManage/CarManage__ToShopRecord',
  component: () => import('@/pages/CarManage/CarManage__ToShopRecord'),
  meta: {
    title: '到店记录'
  }
}]