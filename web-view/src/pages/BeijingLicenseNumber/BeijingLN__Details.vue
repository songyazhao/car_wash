<template>
  <div>
    <scroller ref="myScroller" lock-x scrollbar-y enable-horizontal-swiping>
      <section id="outer">
        <flow slot="flow" class="flow">
          <flow-state state="1" title="业务申请" is-done></flow-state>
          <flow-line is-done></flow-line>

          <template v-if="info.status == -1">
            <flow-state state="2" title="申请失败" is-fail></flow-state>
            <flow-line is-fail></flow-line>
          </template>

          <template v-else>
            <flow-state state="2" title="业务受理" :is-done="info.status > 1"></flow-state>
            <flow-line :is-done="info.status > 1"></flow-line>
          </template>

          <flow-state state="3" title="成功办理" :is-done="info.status > 2"></flow-state>
        </flow>

        <Card class="card">
          <div slot="header" class="header">
            <span>预选车牌：</span>
            <span>{{ info.LicenseNumber }}</span>
          </div>
          <ul slot="content" class="content">
            <li class="content-item"><span>申请人姓名：</span><span>{{ info.name }}</span></li>
            <li class="content-item"><span>申请人电话：</span><span>{{ info.phone }}</span></li>
            <li class="content-item" v-if="info.price"><span>车牌估价：</span><span>{{ info.price + '万' }}</span></li>
            <li class="content-item"><span>当前状态：</span><span>{{ info.status | formatStatus }}</span></li>
            <li class="content-item"><span>申请时间：</span><span>{{ info.add_time }}</span></li>
          </ul>
        </Card>
      </section>
    </scroller>
  </div>
</template>

<script>
import { querystring, XHeader, Scroller, XButton, Card } from 'vux'
import { Flow, FlowState, FlowLine } from '@/components'

let order_id = querystring.parse(decodeURI(location.search)).order_id

export default {
  name: 'BeijingLN__Details',
  components: {
    XHeader, Scroller, XButton, Card,
    Flow, FlowState, FlowLine
  },
  data() {
    return {
      info: {
        LicenseNumber: '',    // 车牌
        name: '',             // 申请人姓名
        phone: '',            // 申请人电话
        price: '',            // 车牌估价
        status: '',           // 状态
        add_time: ''          // 申请时间
      }
    }
  },
  filters: {
    formatStatus(status) {
      switch (~~status) {
        case 1: return '业务申请'
        case 2: return '业务受理'
        case 3: return '办理成功'
        case -1: return '申请失败'
      }
    }
  },
  created() {
    this.$store.commit('updateLoading', true)
    this.$http.post('/index.php/Xiaochengxu/CaiYun/getOrderInfo', { order_id })
      .then((res) => {
        this.$store.commit('updateLoading', false)
        res = res.data

        if (res.code == 0) {
          this.info = res.data
        } else
          this.toastFail(res.msg)
      })
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
#outer {
  margin: 0 10px;
  &::after {
    content: '';
    display: block;
    height: 15px;
  }
  .flow {
    margin: -12px 37px 0;
  }
  .card {
    margin-left: 0 15px;
    @top: 54px;
    &::before {
      top: @top;
    }
    .header,
    .content {
      padding: 0 15px;
    }
    .header,
    .content-item {
      display: flex;
      justify-content: space-between;
    }
    .header {
      font-size: 16px;
      line-height: @top;
    }
    .content {
      color: #A1A1A1;
      padding-bottom: 20px;
      .content-item {
        margin-top: 17px;
        line-height: 13px;
      }
    }
  }
}
</style>
