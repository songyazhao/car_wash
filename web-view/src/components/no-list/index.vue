<template>
  <transition
    enter-active-class="animated flipIn"
    leave-active-class="animated fadeOut"
  >
    <Card v-if="list.length==0" class="no_order">
      <ul slot="content" :style="ulStyle">
        <li :style="liStyle">
          <img src="../../assets/no_order.png" v-if="type === 1">
          <img src="../../assets/no-info.png" v-else>
        </li>
        <li>{{ text }}</li>
      </ul>
    </Card>
  </transition>
</template>

<script>
import { Card } from 'vux'

export default {
  name: 'no-list',
  components: { Card },
  props: {
    list: {
      type: [Object, Array],
      require: true
    },
    text: {
      type: String,
      default: '您当前没有订单哦'
    },
    type: { // icon类型 可选值1、2
      default: 1
    },
    top: {
      type: String,
      default: '45%'
    },
    width: {
      type: String,
      default: 'auto'
    }
  },
  data () {
    return {
      ulStyle: { marginTop: this.top },
      liStyle: { width: this.width }
    }
  }
}
</script>

<style lang="less" scoped>
.no_order {
  background-color: transparent;
  img {
    height: 100%;
    min-height: 60px
  }
  &::before, &::after {
    border: none;
  }
  ul {
    display: flex;
    align-items: center;
    flex-flow: column;
    li:first-child {
      width: 50%;
      img{
        width: 100%;
      }
    }
    li:last-child {
      margin-top: 1.85%;
      font-size: 1em;
      color: #c1c1c1;
    }
  }
}
</style>
