<template>
  <div>
    <Card class="card">
      <div slot="header" class="header">
        <template v-if="code == 1">
          <img src="../../../assets/insurance/cpic.png" />
          <span>太平洋保险</span>
        </template>
        <template v-else-if="code == 2">
          <img src="../../../assets/insurance/paic.png" />
          <span>平安保险</span>
        </template>
        <template v-else-if="code == 4">
          <img src="../../../assets/insurance/picc.png" />
          <span>人保保险</span>
        </template>
        <span class="c_a1 order-status" v-if="orderStatus == -1">核算失败</span>
        <span class="c_a1 order-status" v-if="orderStatus == -2">订单失效</span>
        <span class="c_a1 order-status" v-if="orderStatus == 2">支付倒计时：{{ _time }}</span>
      </div>
      <ul slot="content" class="content">
        <li v-if="insuranceList.ForceTax" class="forcetax">
          <div class="c_59">{{ insuranceName['ForceTax'] }}</div>
          <div class="c_a1 price">{{ getPrice(_list.ForceTax.BaoFei) }}</div>
        </li>
        <li v-if="insuranceList.bizNum > 0" @click="toggle" class="biz">
          <div class="c_59">{{ insuranceName['biz'] +'x'+ insuranceList.bizNum }}</div>
          <div class="c_a1 price">
            {{ getPrice(_list.BizTotal) }}
            <x-icon class="icon-arrow" :class="{ unfold: temp_unfold }" type="ios-arrow-forward" size="13"></x-icon>
          </div>
          <svg v-show="temp_unfold" class="triangle-fill" version="1.1" xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 512 512">
            <path d="M19.2 445.866l236.8-394.666 236.8 394.666z"></path>
          </svg>
        </li>
        <transition
          enter-active-class="slideDown"
          leave-active-class="slideUp"
          @after-enter="$emit('transition-end')"
          @after-leave="$emit('transition-end')"
        >
          <li v-show="temp_unfold" class="biz-list">
            <section
              v-for="(value, name) in insuranceList.biz"
              :key="name"
              class="biz-item"
            >
              <div>
                <span class="c_59">{{ insuranceName[name] }}</span>
                <span class="sdew" v-if="!name.match(/BoLi|HcSanFangTeYue/g) && _list['BuJiMian' + name].BaoE > 0">不计免赔</span>
              </div>
              <div>
                <span class="c_59 premium" v-if="name === 'BoLi'">{{ BoLi[insuranceList.biz[name].BaoE] }}</span>
                <span class="c_59 premium" v-else>{{ formatPrice(insuranceList.biz[name].BaoE) }}</span>
                <span class="c_a1 price">{{ getPrice(insuranceList.biz[name].BaoFei) }}</span>
              </div>
            </section>
          </li>
        </transition>
      </ul>
      <div slot="footer" class="footer">
        <div class="item">
          <span class="c_59 insurance-count">共选择{{ ~~insuranceList.ForceTax.BaoE + insuranceList.bizNum }}中车险</span>
          <span class="c_a1 policy-price" :class="{ quoted: orderStatus > 1 }">{{ getPrice(price.totalAmount, '保单价：') }}</span>
        </div>
        <div class="item discount" v-if="orderStatus > 1">
          <span></span>
          <span class="c_yellow discount-price" :class="{ 'discount-rate': discountRate !== false }" :tips="discountRate">折扣价: <strong>{{ getPrice(price.easyPrice) }}</strong></span>
        </div>
        <div style="height: 17px"></div>
        <slot></slot>
      </div>
    </Card>
  </div>
</template>

<script>
import { Card } from 'vux'
import { mapState } from 'vuex'
import { PrefixInteger, animate, toFixed } from '@/utils'

export default {
  name: 'insurance-list',
  components: { Card },
  props: {
    code: { // 保险公司代号
      type: Number,
      require: true
    },
    list: { // 险种信息
      require: true
    },
    orderStatus: { // 订单状态 1投保受理 2核算成功 3支付成功 4 投保成功 -1核算失败 -2核算失效
      type: Number,
      default: 0
    },
    quoteStatus: { // 报价状态 0未报价 1已报价
      type: Number,
      default: 0
    },
    value: { // 商业险是否展开, 可用v-model绑定
      type: Boolean,
      default: false
    },
    price: { //{totalAmount: 保单价, easyPrice: 折扣价}
      type: Object,
      default: { totalAmount: 0, easyPrice: 0 }
    },
    time: [Number, String] //剩余支付时间(秒)
  },
  data() {
    return {
      temp_unfold: this.value
    }
  },
  computed: {
    ...mapState({
      insuranceName: state => state.CarInsuranceData.insuranceName,
      BoLi: state => state.CarInsuranceData.BoLi,
      // HuaHen: state => state.CarInsuranceData.HuaHen,
      // SanZhe: state => state.CarInsuranceData.SanZhe,
      // SiJi: state => state.CarInsuranceData.SiJi,
      // ChengKe: state => state.CarInsuranceData.ChengKe
    }),
    _list() {
      return typeof this.list === 'string' ? JSON.parse(this.list) : this.list
    },
    insuranceList() { // 险种列表
      let temp = this._list
      let amp = { ForceTax: '', biz: {}, bizNum: 0 }

      for (let key in temp)
        if (temp.hasOwnProperty(key) && key.indexOf('BuJiMian') === -1 && temp[key]['BaoE'] > 0)
          if (key === 'ForceTax')
            amp['ForceTax'] = temp[key]
          else
            (amp['biz'][key] = temp[key], amp.bizNum++)

      animate.slide(amp.bizNum * 41) // 41是css里li实际渲染出来的高
      return amp
    },
    discountRate() { // 折扣比率
      let temp = ( toFixed((this.price.easyPrice / this.price.totalAmount), 2)*10 ).toString()
      if (isNaN(temp) || temp == 0)
        return false
      return temp + '折'
    },
    _time() {
      let hour = 0
      let minute = this.time / 60
      let second = this.time % 60
      if (minute > 60)
        ( hour = parseInt(minute / 60), minute = parseInt(minute % 60) )
      return PrefixInteger(hour, 2) + ':' + PrefixInteger(minute, 2) + ':' + PrefixInteger(second, 2)
    }
  },
  methods: {
    getPrice(price, preJoinStr = '') {
      if (this.orderStatus == 1)
        return '¥ 核算中'
      else if (this.orderStatus == -1)
        return '¥ 核算失败'
      return '¥ ' + preJoinStr + price
    },
    formatPrice(price) {
      if (price / 10000 >= 1) {
        let i = Math.floor(price / 10000).toString()
        i = i > 5 && i < 10 ? '5' :
          i.length == 2 && i < 100 ? i[0] + '0' : i
        return i + '万'
      } else if (price <= 10)
        return ''
      return Math.round(price / 1000) + '千'
    },
    toggle() {
      this.temp_unfold = !this.temp_unfold
      this.$emit('input', this.temp_unfold)
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  .header {
    display: flex;
    align-items: center;
    padding: 8px 10px 8px 22px;
    background-color: #F5F5F5;
    border: 1px solid #E6E6E6;
    box-sizing: border-box;
    img {
      box-sizing: border-box;
      border: 1px solid #C8C8C8;
      border-radius: 50%;
      width: 34px;
      height: 34px;
    }
    span {
      padding-left: 10px;
    }
    .order-status {
      flex-grow: 1;
      text-align: right;
      font-size: 12px;
    }
  }
  @p:  24px;
  .price, .policy-price {
    font-size: 12px;
  }
  .content {
    line-height: 13px;
    padding-top: 15px;
    li, .biz-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 21px;
      padding-right: 35px;
      padding-bottom: @p;
      line-height: 17px;
    }
    .forcetax {

    }
    @fill: #F8F8F8;
    .biz {
      padding-bottom: @p - 10px;
      position: relative;
      .price {
        position: relative;
        .icon-arrow {
          position: absolute;
          top: 0;
          right: -28px;
          fill: #A1A1A1;
          transform: rotateZ(90deg);
          transition: all .35s ease;
          &.unfold {
            transform: rotateZ(-90deg)
          }
        }
      }
      .triangle-fill {
        fill: @fill;
        position: absolute;
        left: 50%;
        top: 10px;
        margin-left: -13px;
        transform: scaleX(1.25);
      }
    }
    .biz-list {
      display: block;
      padding: 0;
      background-color: @fill;
      margin-top: -5px;
      overflow: hidden;
      .biz-item {
        height: 17px;
        padding-left: 47px;
        transform: translateY(@p/2);
        .sdew {
          @yellow: #FFBB00;
          border: 1px solid @yellow;
          color: @yellow;
          font-size: 11px;
          padding: 0 5px;
          margin-left: 6px;
          border-radius: 2px;
          box-sizing: border-box;
        }
        .premium {
          margin-right: 18px;
        }
      }
    }
  }
  .footer {
    padding-top: 8px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 21px;
      padding-right: 35px;
      .insurance-count {}
      .policy-price {
        // margin-right: 3px;
        position: relative;
        &.quoted::after {
          content: '';
          display: block;
          position: absolute;
          left: -8px;
          right: -8px;
          top: 50%;
          height: 1px;
          margin-top: -0.5px;
          background-color: #FF4400;
        }
      }
      .discount {
        margin-top: 18px;
      }
      .discount-price {
        position: relative;
        strong {
          font-weight: 400;
          font-size: 15px;
        }
        &.discount-rate::after {
          content: attr(tips);
          position: absolute;
          right: -3em;
          top: -1em;
          color: white;
          line-height: 11px;
          padding: 0 1px;
          font-size: 7px;
          border-radius: 3px;
          background-color: #FFBB00;
        }
      }
    }
  }
}
</style>
