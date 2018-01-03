<template>
  <div id="app">
    <transition
      enter-active-class="animated flipInY"
      leave-active-class="animated flipOutY"
      mode="out-in"
      v-on:before-enter="beforeEnter"
      v-on:after-enter="afterEnter"
    >
      <router-view></router-view>
    </transition>
    <loading v-model="isLoading.isLoading" id="loading"></loading>
  </div>
</template>
<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    Loading
  },
  computed: {
    ...mapState({
      isLoading: state => state.VuxLoading
    })
  },
  beforeCreate () {
    this.$store.dispatch('getIds')      // 获取shop_id、openid...
    this.$store.dispatch('getCityList') // 获取开通城市列表
  },
  // created () {
  //   this.$store.dispatch('getUserCity') // 获取用户所在的门店,该门店所在的城市
  // },
  methods: {
    beforeEnter() {
      this.$store.commit('updateTransitionEnd', false)
    },
    afterEnter() {
      this.$store.commit('updateTransitionEnd', true)
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './style/animate.css';
@import './style/layout.less';
</style>
