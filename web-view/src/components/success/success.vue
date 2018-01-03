<template>
  <div>
    <Card class="card">
      <div slot="header">
        <slot name="icon"></slot>
        <slot><img src="../../assets/success.png"></slot>
      </div>
      <div slot="content" class="prompt-1 c_59">
        <slot name="prompt-1" v-if="$slots['prompt-1']"></slot>
        <slot v-else>恭喜您提交成功！</slot>
        <slot name="flow"></slot>
      </div>
      <div slot="footer" class="prompt-2 c_59">
        <slot name="prompt-2" v-if="$slots['prompt-2']"></slot>
        <slot v-else style="color:red">请及时查看该微信公众号的反馈消息</slot>
      </div>
    </Card>
  </div>
</template>

<script>
import { Card } from 'vux'

export default {
  name: 'success',
  components: { Card }
}
</script>

<style lang="less" scoped>
.weui-panel {
  text-align: center;
  &::after,
  &::before {
    display: none
  }
  &.card {
    background-color: transparent;
    &>div:nth-child(1) {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 59px;
        height: 59px;
        padding-top: 25px;
        padding-bottom: 18px;
      }
    }
    .prompt-1 {
      font-size: 17px;
      padding-bottom: 4px;
    }
    .prompt-2 {
      font-size: 12px;
      padding-bottom: 22px;
    }
  }
}
</style>
