<template>
  <div>
    <!-- <XHeader @on-click-back="back_home" :left-options="{preventGoBack: true}" v-if="$store.state.isAndroid">{{$route.meta.title}}</XHeader> -->
    <scroller ref="myScroller" height="-55" lock-x scrollbar-y enable-horizontal-swiping>
      <section>

        <div class="page__head">
          <img src="../../assets/car_violation.png">
        </div>

        <div class="page__body">
          <group gutter="0" class="query-box">
            <x-input
              :max="6"
              v-model="license_number_temp"
              @on-change="input_change"
            >
              <x-button
                slot="label"
                class="province_button"
                :text="province_text"
                @click.native="province_items_toggle(true)">
              </x-button>
              <i slot="right" class="icon"></i>
            </x-input>
          </group>

          <div class="placeholder">请输入车牌号码查询违章</div>

          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <group
              gutter="0"
              :label-color="'#a1a1a1'"
              v-show="isShow_CarInfo"
            >
              <x-input
                title="发动机号："
                v-model="carInfo.engineId"
                placeholder="请输入发动机号"
                :disabled="carInfo.isDisabled_engineId"
                :required="true">
              </x-input>
              <x-input
                title="车架号："
                v-model="carInfo.vin"
                placeholder="请输入车架号"
                :disabled="carInfo.isDisabled_vin"
                :required="true">
              </x-input>
            </group>
          </transition>
        </div>

      </section>
    </scroller>
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div class="mask" v-show="is_province_items_show" @click="province_items_toggle(false)"></div>
    </transition>
    <transition
      enter-active-class="animated bounceInUp"
      leave-active-class="animated bounceOutDown"
    >
      <Grid class="province_items" v-show="is_province_items_show">
        <GridItem
          class="item"
          v-for="(item, index) in province_items"
          :key="index"
          :label="item"
          @click.native="select_province(item)">
        </GridItem>
      </Grid>
    </transition>
    <div class="page__footer">
      <x-button text="查询" :disabled="submit_disabled" @click.native="form_submit"></x-button>
    </div>
  </div>
</template>
<script>
import {
  XHeader, Scroller,
  Group, Cell, XInput, XButton,
  Grid, GridItem
} from 'vux'
import { getSign, reg } from '@/utils'

const province_items = ['京','沪','浙','苏','粤','鲁','晋','冀','豫','川','渝','辽','吉','黑','皖','鄂','湘','赣','闽','陕','甘','宁','蒙','津','贵','云','桂','琼','青','新','藏']

export default {
  name: 'CarViolation',
  components: {
    XHeader, Scroller,
    Group, Cell, XInput, XButton,
    Grid, GridItem
  },
  data() {
    return {
      submit_disabled: true,
      province_text: '京',
      province_items: province_items,
      is_province_items_show: false,
      license_number_temp: '',
      openid: this.$store.state.openid,
      isShow_CarInfo: false,
      carInfo: {//发动机号 车架号
        engineId: '',
        isDisabled_engineId: true,
        vin: '',
        isDisabled_vin: true
      }
    }
  },
  computed: {
    license_number() {
      return this.province_text + this.license_number_temp
    }
  },
  mounted() {
    const _ = this
    // _.license_number = _.$store.state.license_number;//获取组件间共享的数据
    let OID = document.querySelector('.icon').outerHTML.match(/(data-v-[0-9a-zA-Z]{8})/)[0]
    document.querySelector('.query-box .weui-cell input').setAttribute(OID, '')
    document.querySelector('.query-box .weui-cell .weui-cell__ft').setAttribute(OID, '')
  },
  methods: {
    province_items_toggle(bool) {
      this.is_province_items_show = bool
    },
    select_province(item) {
      this.province_text = item
      this.province_items_toggle(false)
      this.input_change(this.license_number_temp)
    },
    // back_home() {
    //   this.$router.replace('/')
    // },
    toast_fail(msg = '查询失败') {
      this.$vux.toast.show({
        text: msg,
        type: 'text',
        isShowMask: true,
        position: 'middle',
        width: '9em'
      })
    },
    submit_err(msg = '车牌号输入有误') {
      this.$vux.toast.show({
        text: msg,
        type: 'text',
        isShowMask: true,
        position: 'middle',
        width: '11em'
      })
      return false
    },
    input_change(val) {
      const _ = this

      _.license_number_temp = val.toUpperCase()

      if (val.length >= 6) {//根据车牌查询车架号发动机号
        if (!reg('license_number', _.license_number))
          return _.submit_err()

        let submit_data = {
          license_number: _.license_number,
          openid: _.openid
        }

        submit_data.sign = getSign(submit_data)//追加签名验证

        this.$store.commit('updateLoading', true)
        _.$http.post('/index.php/Api/CarViolation/getVehicleInformation', submit_data)
        .then((response) => {// 响应成功回调
          this.$store.commit('updateLoading', false)

          if (response.data.code == 0) {//查询发动机号成功
            let data = response.data.data
            if (data.engineId == '') {
              _.carInfo.isDisabled_engineId = false
            }
            if (data.vin == '') {
              _.carInfo.isDisabled_vin = false
            }
            _.carInfo.engineId = data.engineId
            _.carInfo.vin = data.vin
            _.isShow_CarInfo = true
          } else {
            _.toast_fail(response.data.msg)
          }
        }, (response) => {// 响应错误回调
          console.info('查询发动机号失败', response)
          _.toast_fail(response.data.msg)
        })
      } else if (val == '') {
        _.isShow_CarInfo = false
      }
    },
    form_submit() {//表单提交事件
      const _ = this, submit_data = {
        openid: _.openid,
        license_number: _.license_number,
        vin: _.carInfo.vin,
        engineId: _.carInfo.engineId
      }

      if (!reg('license_number', _.license_number))
        return _.submit_err()
      if (_.carInfo.engineId == '')
        return _.submit_err('请输入发动机号')
      if (_.carInfo.vin == '')
        return _.submit_err('请输入车架号')

      submit_data.sign = getSign(submit_data)//追加签名验证

      _.$store.commit('updateLoading', true)
      _.$http.post('/index.php/Api/CarViolation/getCarViolation', submit_data)
      .then((response) => {// 响应成功回调
        _.$store.commit('updateLoading', false)

        if (response.data.code == 0) {//查询违章成功
          sessionStorage.jump_source = 'web'
          _.isShow_CarInfo = false
          location.href = _.$store.state.host_name+ '/Api/CarViolation/violationList?openid='+ _.openid +'&license_number='+ _.license_number
        } else {
          _.toast_fail(response.data.msg)
        }
      }, (response) => {// 响应错误回调
        console.info('查询违章失败', response)
        _.toast_fail(response.data.msg)
      })
    },
  },
  watch: {
    license_number_temp(val) {
      if (val.length >= 6) {//按钮可点击
        this.submit_disabled = false
      }else {//按钮不可点击
        this.submit_disabled = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.query-box .weui-cell{
  padding: 0!important;
  font-size: 17px!important;
  color: #FB0;
  input{
    letter-spacing: 1.5em;
    text-indent: 16px;
  }
  .weui-cell__ft{
    margin-right: 5px;
  }
}
.weui-cell{
  &::before{left: 0}
}
.page__head{
  height: 215px;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 48%;
    margin-left: 10%;
    margin-top: 3.5%;
  }
}
.page__body {
  margin: 0 28px;
  position: relative;
  .placeholder{
    text-align: center;
    color: #808080;
    font-size: 12px;
    line-height: 22px;
    padding-bottom: 8px;
  }
  .province_button{
    color: white;
    width: 52px;
    height: 52px;
    background-color: #FB0;
    font-size: 17px;
  }
  i.icon{
    position: absolute;
    right: 0;
    bottom: 2px;
    left: 40px;
    width: 0;
    height: 0;
    border-bottom: 10px solid white;
    border-left: 10px solid transparent;
  }
}

.province_items {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #F0F0F0;
  color: #2D38A1;
  z-index: 99;
  padding: 1% 0;
  &::before, &::after{
    border: none;
  }
  .item{
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 2px #999;
    margin: 1.35% 1.055%;
    padding: 12px 0px;
    width: 9%!important;
    &::before, &::after{
      border: none;
    }
  }
}
@media (min-width: 414px) and (min-height: 736px){
  .page__head{
    height: 250px;
  }
}
</style>
