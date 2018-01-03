export default [{
  name: 'CarBrandOne',
  path: '/:ParentPage/CarBrand/CarBrandOne',
  component: () => import('@/pages/Common/CarBrand/SelectCarBrandOne'),
  meta: {
    title: '选择品牌'
  }
}, {
  name: 'CarBrandTwo',
  path: '/:ParentPage/CarBrand/CarBrandTwo',
  component: () => import('@/pages/Common/CarBrand/SelectCarBrandTwo'),
  meta: {
    title: '选择车系'
  }
}]