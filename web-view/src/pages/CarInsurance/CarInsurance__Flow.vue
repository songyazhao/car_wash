<template>
  <div>
    <scroller ref="myScroller" lock-x scrollbar-y enable-horizontal-swiping>
      <section id="outer">
        <div class="order-sn c_59">订单号：{{ order_sn }}</div>
        <flow slot="flow" class="flow">
          <flow-state state="1" title="投保受理" is-done></flow-state>
          <flow-line is-done></flow-line>

          <template v-if="orderStatus == -1">
            <flow-state state="2" title="核算失败" is-fail></flow-state>
            <flow-line is-fail></flow-line>
          </template>

          <template v-else-if="orderStatus == -2">
            <flow-state state="2" title="订单失效" is-fail></flow-state>
            <flow-line is-fail></flow-line>
          </template>

          <template v-else>
            <flow-state state="2" title="核算成功" :is-done="orderStatus > 1"></flow-state>
            <flow-line :is-done="orderStatus > 1"></flow-line>
          </template>

          <flow-state state="3" title="支付成功" :is-done="orderStatus > 2"></flow-state>
          <flow-line :is-done="orderStatus > 2"></flow-line>

          <flow-state state="4" title="投保成功" :is-done="orderStatus > 3"></flow-state>
        </flow>
        <InsuranceHeader
          class="insurance-header"
          :license-number="licenseNumber"
          :carType="carType"
          :insurance-company="insuranceCompany"
          :applicant-and-insured="applicantAndinsured"
        />
        <InsuranceList
          class="insurance-list"
          v-for="(item, index) in orderInfo"
          :key="index"
          v-model="item.unfold"
          :order-status="~~orderStatus"
          :code="~~item.InsuranceCompany_code"
          :list="item.insurance"
          :price="{ totalAmount: item.total_amount, easyPrice: item.easyPrice }"
          :time="item.remaining_time"
          @transition-end="$refs.myScroller.reset()"
        >
          <div class="buttons" v-if="orderStatus == 2">
            <x-button class="edit-button" :class="{ unfold: !item.unfold }" text="修改险种" @click.native="edit(item.order_id)"></x-button>
            <x-button class="ok-button" :class="{ unfold: item.unfold }" text="确认支付" @click.native="ok(item.order_id)"></x-button>
          </div>
        </InsuranceList>
      </section>
    </scroller>
  </div>
</template>

<script>
import { querystring, XHeader, Scroller, XButton } from 'vux'
import { Flow, FlowState, FlowLine } from '@/components'
import { InsuranceHeader, InsuranceList } from './components'
import { mapState } from 'vuex'
import { JsonToUrlParam, callWxPay } from '@/utils'

const source = 'wx'

export default {
  name: 'CarInsurance__Flow',
  components: {
    XHeader, Scroller, XButton,
    Flow, FlowState, FlowLine, InsuranceHeader, InsuranceList
  },
  data() {
    return {
      order_sn: querystring.parse(decodeURI(location.search)).order_sn,
      orderStatus: 0,              // 订单状态
      carType: "",                 // 车型
      insuranceCompany: "",        // 投保险种
      applicantAndinsured: {       // 投保人/受益人
        insured_eq_applicant: 1,       // 投保人受益人是否一致 1一致 0不一致
        applicant: '',                 // 投保人名字
        insured: '',                   // 受益人名字
      },
      licenseNumber: "",           // 车牌号
      orderInfo: [
        {
          InsuranceCompany_code: "", //保险公司代号
          insurance: {}            // 已选择的车险信息
        }
      ]
    }
  },
  computed: {
    ...mapState({
      openId: state => state.openid,
      host_name: state => state.host_name
    })
  },
  created() {
    this.$store.commit('updateLoading', true)
    this.$http.post('/index.php/Xiaochengxu/CarInsurance/orderInfo', { openId: this.openId, order_sn: this.order_sn })
      .then((res) => {
        this.$store.commit('updateLoading', false)
        res = res.data
        const data = res.data

        if (res.code == 0) {
          let { insured_eq_applicant, applicant, insured } = data
          this.applicantAndinsured = data.orderStatus > 1 ? { insured_eq_applicant, applicant, insured } : false
          this.carType = data.carType
          this.orderStatus = data.orderStatus
          this.licenseNumber = data.licenseNumber
          this.insuranceCompany = data.insuranceCompany
          this.orderInfo = data.orderInfo.map(v => (v.unfold = false, v))

          this.$nextTick(() => this.$refs.myScroller.reset())
          this.orderStatus == 2 && this.orderInfo.forEach(v => { // 倒计时
            v.remaining_time && setInterval(() => {
              v.remaining_time--
            }, 1000)
          })
          this.$route.meta.title = document.title = this.getTitle(this.orderStatus) // 根据进度显示页面标题
        } else
          this.toastFail(res.msg)
      })
  },
  methods: {
    getTitle(state) {
      switch (~~state) {
        case 1: return '核保受理详情'
        case 2: return '核算成功'
        case 3: return '保险进度详情'
        case 4: return '投保成功详情'
        default: return '核保受理详情'
      }
    },
    edit(order_id) { // 修改险种
      this.$router.push({
        name: 'CarInsurance__Select',
        query: { baseURL: '/index.php/Xiaochengxu/CarInsurance/editInsurance' },
        params: {
          source,
          license_number: this.licenseNumber,
          openid: this.openId,
          order_sn: this.order_sn,
          order_id
        }
      })
    },
    ok(order_id) { // 确认支付
      this.pay({ order_id, openid: this.openId })
    },
    /**
     * @param {Object} params 参数
     * @param {String} action 要请求的接口地址
     * @param {String} url    回调函数中要跳转的URL
     */
    pay(params, action = '/index.php/Api/WxPay/payCarInsurance', name = 'CarInsurance__Result') {
      this.$store.commit('updateLoading', true)
      this.$http.post(action, params)
        .then((res) => {
          this.$store.commit('updateLoading', false)
          res = res.data
          if (res.code != 1)
            callWxPay(
              JSON.parse(res.jsApiParameters),
              () => this.$router.replace({ name, params: { state: 3 } }), //微信支付成功回调
              this
            )
          else
            this.toastFail(res.msg)
        })
    }
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
  .order-sn {
    font-size: fz = 12px;
    line-height: fz;
    margin: 14px 0;
  }
  .flow {
    margin: -41px -10px 0;
  }
  .insurance-header {
    margin-top: -10px;
  }
  .insurance-list {
    margin-top: 9px;
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        font-size: 16px;
        line-height: 16px;
        color: white;
        margin: 0;
        padding: 18px 0;
        transition: all .4s cubic-bezier(.25,.46,.45,.94);
      }
      .edit-button {
        background-color: #46B7C5;
        margin-right: 1%;
        flex-basis: 50%;
        white-space: nowrap;
        &.unfold {
          margin-right: 0%;
          flex-basis: 0%;
        }
      }
      .ok-button {
        background-color: #FFBB00;
        flex-basis: 100%;
        &.unfold {
          flex-basis: 50%;
        }
      }
    }
  }
}
</style>
