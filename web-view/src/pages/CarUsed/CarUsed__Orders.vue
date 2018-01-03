<template>
  <div>
    <scroller
      ref="myScroller"
      lock-x
      scrollbar-y
      enable-horizontal-swiping>
      <section>

        <div class="page__head"></div>

        <div class="page__body">
          <Card
            class="item"
            v-if="order_list.length>0"
            :key="index"
            v-for="(item, index) in order_list">
            <div slot="header" class="header" :style="{color: item.kind.color}">
              {{ item.kind.text }}
            </div>
            <div slot="content" class="content">
              <div class="logo">
                <img :src="item.brand_logo"/>
              </div>
              <ul class="brand_info">
                <li>{{ item.model_name }} {{ item.detail_model_name }}</li>
                <li :style="{visibility: item.isQuotes==1 ? 'visible' : 'hidden'}">{{ item.card_time }} / {{ item.mileage }}万公里</li>
                <li :style="{visibility: item.isQuotes==1 ? 'visible' : 'hidden'}">{{ item.vehicle_price }}万元</li>
              </ul>
            </div>
            <div slot="footer" class="footer">
              提交时间：{{ item.add_time }}
            </div>
          </Card>

          <Card v-if="order_list.length==0" class="no_order">
            <ul slot="content">
              <li>
                <img src="../../assets/no_order.png">
              </li>
              <li>您当前没有订单哦</li>
            </ul>
          </Card>
        </div>

      </section>
    </scroller>
  </div>
</template>

<script>
import { Scroller, Card } from 'vux'
import { querystring } from 'vux'

export default {
  name: 'CarUsed__Orders',
  components: {
    Scroller, Card
  },
  data() {
    return {
      list: [],
      params: querystring.parse(decodeURI(location.search))
    }
  },
  computed: {
    order_list() {
      function format(status) {
        switch (~~status) {
          case 1: return {text: '已提交', color: '#A1A1A1'}
          case 2: return {text: '处理中', color: '#5D98C2'}
          case 3: return {text: '交易成功', color: '#68A944'}
          case 4: return {text: '交易失败', color: '#DE4E4E'}
        }
      }

      this.list.forEach(v => v.kind = format(v.status))

      return this.list
    }
  },
  mounted() {
    const _ = this;

    _.$store.state.isGetId && _.$store.commit('get_id', true)
    _.$store.commit('updateLoading', true)
    _.$http.post('/index.php/Api/SecondHand/wechatCarList'
    , {
      page: 1,
      row: 100,
      openid: _.$store.state.openid
    })
    .then((response) => {// 响应成功回调
      _.$store.commit('updateLoading', false)

      if (response.data.code == 0) {//查询订单成功
        _.list = response.data.data
        _.$nextTick(() => {
          _.$refs.myScroller.reset()
        })
      } else {
        _.toast_fail(response.data.msg)
      }
    }, (response) => {// 响应错误回调
      console.info('获取订单失败', response)
      _.toast_fail(response.data.msg)
    })
  },
  methods: {
    toast_fail(msg = '获取订单失败') {
      this.$vux.toast.show({
        text: msg,
        type: 'cancel',
        isShowMask: true,
        position: 'middle',
        width: '10em'
      })
    }
  }
}
</script>

<style lang="less" scoped>
 @time-color: #B3B3B3;
img {height: 100%}
.page__body {
  margin: 10px;
  .item {
    box-shadow: 0 0 10px #D3D3D3;
    &::before, &::after {
      border: none
    }
    .header {
      text-align: right;
      padding: 10px 11px 3px;
    }
    .content {
      display: flex;
      align-items: center;
      .logo {
        height: 68px;
        margin: 0 15px;
        border: 1px solid #E9EBED;
      }
      .brand_info {
        li:first-child {
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: 19em;
        }
        li:nth-child(2) {
          color: @time-color;
          font-size: 11px;
        }
        li:nth-child(3) {
          font-size: 16px;
          color: #FB0;
          &:before {
            content: '预估价：';
            font-size: 12px;
            color: #000;
          }
        }
      }
    }
    .footer {
      color: @time-color;
      text-align: right;
      padding: 12px 11px 15px;
    }
  }
  .no_order {
    background-color: transparent;
    &::before, &::after {
      border: none;
    }
    ul {
      margin-top: 45%;
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
        font-size: 1.2em;
        color: #c1c1c1;
      }
    }
  }
}
</style>
