<template>
  <div>
    <XHeader @on-click-back="$router.replace('/')" :left-options="{preventGoBack: true}" v-if="$store.state.isAndroid">{{$route.meta.title}}</XHeader>
    <scroller ref="myScroller" :height="$store.state.isAndroid?'-46':''" lock-x scrollbar-y enable-horizontal-swiping>
      <section>
        <success>
          <div slot="prompt-2" class="c_99">请等待客服人员联系车主</div>
        </success>
        <Card class="card-1">
          <div slot="header">
            <img :src="car_info.brand_logo">
          </div>
          <div slot="content" class="car_brand" v-html="car_name"></div>
          <ul slot="footer" class="car_info" v-show="is_show_chart">
            <li>
              <div>上牌日期：{{ car_info.card_time }}</div>
              <div>零售价格：<strong role="one">{{ car_info.vehicle_price }}</strong> 万元</div>
            </li>
            <li>
              <div>行驶历程：{{ car_info.mileage }}万公里</div>
              <div>收购价格：<strong role="two">{{ car_info.purchasing_price }}</strong> 万元</div>
            </li>
            <li class="prompt">此价格仅供参考</li>
          </ul>
        </Card>
        <Card class="card-2" v-show="is_show_chart">
          <v-line slot="content" :trendData="car_info.priceTrend"></v-line>
        </Card>
      </section>
    </scroller>
  </div>
</template>

<script>
import { XHeader, Scroller, Card } from 'vux'
import line from './Chart/line'
import { Success } from '@/components'

export default {
  name: 'CarUsed__Result',
  components: {
    XHeader, Scroller, Card,
    'v-line': line,
    Success
  },
  data () {
    return {
      car_info: {
        brand_logo: "",
        model_name: "",
        detail_model_name: "",
        card_time: "",
        mileage: "",
        vehicle_price: "",
        purchasing_price: "",
        priceTrend: {//折线图数据
          vehicle_price: [],
          purchasing_price: []
        }
      }
    }
  },
  computed: {
    is_show_chart() {
      return this.$store.state.CarUsedData.isQuotes
    },
    car_name() {
      let str = this.car_info.model_name +'/'+ this.car_info.detail_model_name
      if (str.length > 18)
        return str.replace('/', '<br/>')
      return str
    }
  },
  mounted() {
    this.car_info = this.$route.params.car_info
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.weui-panel{
  text-align: center;
  &::after, &::before {display: none}
  &.card-1, &.card-2{
    margin-left: 10px;
    margin-right: 10px;
    box-shadow: 1px 1px 8px #d9d9d9;
  }
  &.card-1{
    color: black;
    margin-top: 0;
    margin-bottom: 0;
    & > div:nth-child(1){
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        height: 68px;
        border: 1px solid #E9EBED;
        margin-top: 25px;
        margin-bottom: 9px;
      }
    }
    .car_brand{
      font-size: 14px;
      line-height: 17px;
      padding-bottom: 14px;
      max-width: 80%;
      margin: 0 40px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .car_info{
      font-size: 12px;
      line-height: 12px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      li:not(.prompt){
        &:nth-child(2){
          margin-left: 2.5em;
        }
        div{
          text-align: left;
          &:first-child{
            margin-bottom: 14px;
          }
        }
      }
      .prompt {
        width: 100%;
        color: #999999;
        font-size: 11px;
        text-align: center;
        margin: 10px 0;
      }
      strong{
        font-size: 14px;
        font-weight: normal;
        &[role="one"]{
          color: #46B7C5;
        }
        &[role="two"]{
          color: #FFBB00;
        }
      }
    }
  }
}
</style>
