<template>
  <div>
    <XHeader :left-options="{showBack: false}" v-if="$store.state.isAndroid">{{ $route.meta.title }}</XHeader>
    <scroller ref="myScroller" :height="$store.state.isAndroid?'-46':''" lock-x scrollbar-y enable-horizontal-swiping>
      <section>
        <success>
          <flow slot="flow" v-if="!hideFlow">
            <flow-state state="1" title="投保受理" is-done></flow-state>
            <flow-line :is-done="state > 1" :tip="state == 1 ? '进行中' : ''"></flow-line>

            <flow-state state="2" title="核算成功" :is-done="state > 1"></flow-state>
            <flow-line :is-done="state > 2" :tip="state == 2 ? '进行中' : ''"></flow-line>

            <flow-state state="3" title="支付成功" :is-done="state > 2"></flow-state>
            <flow-line :is-done="state > 3" :tip="state == 3 ? '进行中' : ''"></flow-line>

            <flow-state state="4" title="投保成功"></flow-state>
          </flow>
          <div slot="prompt-1" v-if="state == 3">恭喜您支付成功！</div>
          <div slot="prompt-2">请及时查看该微信公众号的反馈消息</div>
        </success>
      </section>
    </scroller>
  </div>
</template>

<script>
import { XHeader, Scroller } from 'vux'
import { Success, Flow, FlowState, FlowLine} from '@/components'

export default {
  name: 'CarInsurance__Result',
  components: {
    XHeader, Scroller, Flow, FlowState, FlowLine,
    Success
  },
  data() {
    return {
      state: ~~this.$route.params.state||1,
      hideFlow: ~~this.$route.params.hideFlow
    }
  },
  created () {
    if (this.state == 3)
      document.title = '支付成功'
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'CarInsurance__Select' && WeixinJSBridge)
      WeixinJSBridge.call('closeWindow') // 关闭浏览器窗口
    else
      next()
  }
}
</script>

<style lang="less" scoped>

</style>
