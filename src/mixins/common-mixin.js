import wepy from 'wepy'

export default class CommonMixin extends wepy.mixin {
  data = {}
  methods = {}

  onShow() { }

  onLoad(e) {
    console.info('->->Log :: 当前存在的栈: ', getCurrentPages())
    console.info('->->Log :: 页面参数: ', e)
    wepy.showNavigationBarLoading()
  }

  onReady() {
    if (typeof ajax === 'undefined')
      wepy.$instance.delayExecute().then(r => wepy.hideLoading())
    wepy.$instance.delayExecute(800).then(r => wepy.hideNavigationBarLoading())
  }
}
