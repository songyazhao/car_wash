<template>
  <div>
    <scroller ref="myScroller" height="-55" lock-x scrollbar-y enable-horizontal-swiping>
      <section>
        <div class="page__head" :style="{ marginTop }">
          <img src="../../assets/xingxing.png">
        </div>

        <div class="page__body">
          <LicenNumberInput class="licen-number" :class="isShow_CarInfo && 'border-top'" ref="LicenNumberInput" v-model="license_number" />

          <transition enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">

            <group gutter="0" :label-color="'#a1a1a1'" label-width="75px" v-show="isShow_CarInfo">
              <x-input
                title="车主姓名："
                v-model="carInfo.driverName"
                placeholder="请输入车主姓名"
                :show-clear="false"
                @on-change="driverName = ''"
                required>
              </x-input>
              <x-input
                title="发动机号："
                v-model="carInfo.engineId"
                placeholder="请输入发动机号"
                :show-clear="false"
                @on-change="engineId = ''"
                required>
              </x-input>
              <x-input
                title="车架号："
                v-model="carInfo.vin"
                placeholder="请输入车架号"
                :show-clear="false"
                @on-change="vin = ''"
                required>
              </x-input>
              <x-input
                title="品牌型号："
                v-model="carInfo.model"
                placeholder="请输入品牌型号"
                :show-clear="false"
                required>
              </x-input>
              <x-input
                title="注册日期："
                v-model="carInfo.firstRegisteTime"
                placeholder="日期格式：1970-01-01"
                :show-clear="false"
                required>
              </x-input>
              <x-input
                title="交强险："
                :style="{color: renewal_color(carInfo.renewal[0].color)}"
                v-model="carInfo.renewal[0].desc"
                readonly
                required>
              </x-input>
              <x-input
                title="商业险："
                :style="{color: renewal_color(carInfo.renewal[1].color)}"
                v-model="carInfo.renewal[1].desc"
                readonly
                required>
              </x-input>
            </group>

          </transition>
        </div>
      </section>
    </scroller>
    <ProvinceItem/>
    <div class="page__footer">
      <x-button text="办理" :disabled="submit_disabled" @click.native="form_submit"></x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, Scroller, Group, Cell, XInput, XButton } from 'vux'
import { LicenNumberInput } from '@/components'
import { mapState } from 'vuex'
import { getSign, reg, JsonToUrlParam, replacePos } from '@/utils'

const source = 'wx' // 微信来源标识

export default {
  name: 'CarInsurance',
  components: {
    XHeader, Scroller, Group, Cell, XInput, XButton,
    LicenNumberInput: LicenNumberInput.LicenNumberInput,
    ProvinceItem: LicenNumberInput.ProvinceItem
  },
  data() {
    return {
      marginTop: '33%',
      submit_disabled: true,
      license_number: '',
      isShow_CarInfo: false,
      vin: "",
      engineId: "",
      driverName: "",
      carInfo: {
        vin: "",
        engineId: "",
        driverName: "",
        firstRegisteTime: "",
        model: "",
        // vehicle_Idcard: "",
        forceExpireDate: "",
        businessExpireDate: "",
        renewal: [{
          desc: ""
        }, {
          desc: ""
        }]
      }
    }
  },
  computed: {
    ...mapState({
      openid: state => state.openid,
      open_city: state => state.open_city.CarInsurance // 查车险的开通城市
    })
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'CarInsurance__Result' && WeixinJSBridge)
      WeixinJSBridge.call('closeWindow') // 关闭浏览器窗口
    else
      next()
  },
  methods: {
    renewal_color(status) { // 根据投保到期状态 返回指定颜色
      switch (~~status) {
        case 0: return '#FE9B00'
        case 1: return '#24B22A'
        case 2: return '#2D3841'
      }
    },
    form_submit() {//表单提交事件
      if (this.openid != 'oukJixJzCyGkn3wUJs4DT4bTUFD0' && ~~this.open_city != 2)
        return this.toastFail('当前仅支持北京查车险')

      const submit_data = {
        source,
        license_number: this.license_number,                  // 车牌号
        vehicle_owner: this.driverName||this.carInfo.driverName, // 车主姓名
        engine_number: this.engineId||this.carInfo.engineId,     // 发动机号
        frame_number: this.vin||this.carInfo.vin,                // 车架号
        model: this.carInfo.model,                            // 品牌型号
        firstRegisteTime: this.carInfo.firstRegisteTime       // 注册日期
      }

// console.log(submit_data)
      if (!/^[a-z\d]+$/gi.exec(submit_data.engine_number))
        return this.toastFail('请输入正确的发动机号', 14)
      if (!/^[a-z\d]{17}$/gi.exec(submit_data.frame_number))
        return this.toastFail('请输入正确的车架号', 13)
      if (!/^\d{4}\-\d{2}\-\d{2}$/g.exec(submit_data.firstRegisteTime))
        return this.toastFail('日期格式错误')
// return false

      submit_data.sign = getSign(submit_data)//追加签名验证
      this.$store.commit('updateLoading', true)
      this.$http.post('/index.php/Api/CarInsurance/saveCarType', submit_data)
        .then(res => {// 响应成功回调
          res = res.data
          console.info('查询车牌成功', res)

          this.$store.commit('updateLoading', false)
          if (res.code == 0) {//提交成功
            this.$router.push({
              name: 'CarInsurance__Select',
              query: { baseURL: '/index.php/Api/CarInsurance/selectInsuranceType' },
              params: {
                source,
                license_number: this.license_number,
                openid: this.openid
              }
            })
          } else
            this.toastFail(res.msg||'查询失败')

        }, res => {// 响应错误回调
          console.info('查询车牌失败', res)
          this.toastFail(res.data.msg)
        })
    },
  },
  watch: {
    isShow_CarInfo(bool) {
      this.marginTop = bool ? 0 : '33%'
      if (!bool)
        for (var key in this.carInfo)
          if(this.carInfo.hasOwnProperty(key) && typeof this.carInfo[key] === 'string')
            this.carInfo[key] = ''
    },
    carInfo: {
      deep: true,
      handler(val) {
        // case 0: return { text: '已脱保', color: '#FF575D' }
        // case 1: return { text: '已到投保期', color: '#97CB55' }
        // case 2: return { text: '未到投保期', color: '#C9C9C9' }
        // case -1: return { text: '未查询到投保状态', color: '#C9C9C9' }
        delete val.vehicle_Idcard

        if (val && val.renewal[0]) // 已到投保期的才能 点击办理按钮
          if (val.renewal[0].status != 1 && val.renewal[0].status != 1)
            return this.submit_disabled = true

        for (var key in val) {
          if (val.hasOwnProperty(key) && '' === val[key]) {
            return this.submit_disabled = true
          }
          this.submit_disabled = false
        }
      }
    },
    license_number(val) {
      if (val.length > 6) {
        if (!reg('license_number', this.license_number))
          return this.toastFail('车牌号输入有误')

        let submit_data = {
          source,
          license_number: this.license_number,
          openid: this.openid
        }

        submit_data.sign = getSign(submit_data)//追加签名验证

        this.$store.commit('updateLoading', true)
        //根据车牌查询车架号发动机号
        this.$http.post('/index.php/Api/CarInsurance/getCarType', submit_data)
          .then(res => {// 响应成功回调
            this.$store.commit('updateLoading', false)

            res = res.data
            if (res.code == 0) {//查询发动机号成功
              let data = res.data
              let { driverName, engineId, vin } = data

              Promise.resolve().then(() => {
                this.driverName = driverName
                this.engineId = engineId
                this.vin = vin
              })

              // 信息脱敏
              data.driverName = replacePos(data.driverName, '*', [1, 1])
              data.engineId = replacePos(data.engineId, '***', [4, 5])
              data.vin = replacePos(data.vin, '***', [7, 12])

              this.carInfo = data
              this.isShow_CarInfo = true

              this.$nextTick(() => {
                this.$refs.myScroller.reset()
              })
            } else {
              this.isShow_CarInfo = false
              this.toastFail(res.msg)
            }
          }, res => {// 响应错误回调
            console.info('查询发动机号失败', res)
            this.isShow_CarInfo = false
            this.toastFail(res.msg)
          })
      } else {
        this.isShow_CarInfo = false
        this.submit_disabled = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page__head {
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: margin-top .5s ease-out;
  img {
    width: 38%;
  }
}

.page__body {
  margin: 0 28px;
  overflow: hidden;
  .licen-number {
    position: relative;
    z-index: 999;
  }
  .border-top:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    left: 52px;
    border-top: 1px solid #EEE;
  }
}
</style>
