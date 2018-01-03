export default [{
  name: 'BeijingLN__Select',
  path: '/BeijingLN__Select',
  component: () => import('@/pages/BeijingLicenseNumber/BeijingLN__Select'),
  meta: {
    title: '车牌选择'
  },
  // children: [{ // (带靓号功能,改方案了暂时用不到)
  //   name: 'BeijingLN__SelectAll',
  //   path: 'all',
  //   component: () => import('@/pages/BeijingLicenseNumber/BeijingLN__SelectAll'),
  //   meta: {
  //     title: '车牌选择'
  //   }
  // }]
}, {
  name: 'BeijingLN__AddInfo',
  path: '/BeijingLN__AddInfo',
  component: () => import('@/pages/BeijingLicenseNumber/BeijingLN__AddInfo'),
  meta: {
    title: '填写信息'
  }
}, {
  name: 'BeijingLN__Result',
  path: '/BeijingLN__Result',
  component: () => import('@/pages/BeijingLicenseNumber/BeijingLN__Result'),
  meta: {
    title: '提交成功'
  }
}, {
  name: 'BeijingLN__Details',
  path: '/BeijingLN__Details',
  component: () => import('@/pages/BeijingLicenseNumber/BeijingLN__Details'),
  meta: {
    title: '业务详情'
  }
}]