<template>
  <div>
    <!-- <XHeader
      @on-click-back="back_home"
      :left-options="{preventGoBack: true}"
      v-if="$store.state.isAndroid">
      {{$route.meta.title}}
    </XHeader> -->
    <scroller
      ref="myScroller"
      height="-55"
      lock-x
      scrollbar-y
      enable-horizontal-swiping>
      <section>

        <div class="page__head">
          <img class="banner" src="../../assets/carloan_banner.png">
        </div>

        <div class="page__body">
          <group class="panel_1" gutter="0" labelWidth="6em">
            <x-address
              title="所在城市:"
              v-model="CarLoanData.city_id"
              :list="address"
              placeholder="请选择您所在地区"
              :hide-district="true"
              value-text-align="right"
              @on-show="address_show"
              @on-hide="address_hide">
            </x-address>
            <x-input
              class="carbrand weui-cell_access"
              title="车辆品牌:"
              v-model="CarLoanData.model_name"
              placeholder="请选择品牌&车型"
              :readonly="true"
              :text-align="input_align"
              :placeholder-align="input_align">
              <router-link
                :to="{name: 'CarBrandOne', params: {ParentPage: $route.name}}"
                slot="right"
                style="position:absolute;right:-1em;top:-2em;width:22em;height:4em;">
              </router-link>
            </x-input>
            <x-input
              title="车主电话:"
              v-model="CarLoanData.mobile"
              type="tel"
              placeholder="请填写车主电话"
              :required="true"
              :max="11"
              class="tel"
              :is-type="tel_check"
              :text-align="input_align"
              :placeholder-align="input_align"
              @on-blur="tel_blur">
            </x-input>
            <x-input
              title="车主姓名:"
              v-model="CarLoanData.name"
              placeholder="请填写车主姓名(选填)"
              :max="10"
              :is-type="name_check"
              :text-align="input_align"
              :placeholder-align="input_align">
            </x-input>
          </group>
        </div>

      </section>
    </scroller>

    <div class="page__footer">
      <x-button
        text="提交"
        :disabled="submit_disabled"
        @click.native="form_submit">
      </x-button>
    </div>
  </div>
</template>

<script>
import {
  XHeader, Scroller,
  Flexbox, FlexboxItem,
  Grid, GridItem,
  Group, XInput, XButton, Datetime, XAddress
} from 'vux'
import { getSign, reg } from '@/utils'
import { mapState } from 'vuex'

export default {
  name: 'CarLoan',
  components: {
    XHeader, Scroller,
    Flexbox, FlexboxItem,
    Grid, GridItem,
    Group, XInput, XButton, Datetime, XAddress
  },
  data() {
    const model_name = this.$route.params.model_name||''
    const detail_model_id = this.$route.params.detail_model_id||''
    return {
      CarLoanData: {},
      start_date: '2007-01-01',
      end_date: new Date().getFullYear() + '-12-01',
      temp_city_info: [],
      submit_disabled: true,
      input_align: 'right',
			label_color: 'black'
    }
  },
  computed: {
    ...mapState({
      address: state => state.city_list
    })
  },
  mounted() {
    this.CarLoanData = this.$store.state.CarLoanData;//获取组件间共享的数据
    this.$nextTick(() => {
      this.$refs.myScroller.reset()
    })
  },
  methods: {
    back_home() {
      this.$router.replace('/')
    },
    form_submit() {//表单提交事件
      const _ = this, submit_data = Object.assign({}, _.CarLoanData)

      if (!reg('name', submit_data.name)) {
        _.$vux.toast.show({
          text: '姓名限定为中英文',
          type: 'text',
          isShowMask: true,
          position: 'middle',
          width: '12em'
        })
        return false
      }
      if (!reg('tel', submit_data.mobile)) {
        _.$vux.toast.show({
          text: '请输入正确的手机号',
          type: 'text',
          isShowMask: true,
          position: 'middle',
          width: '12.5em'
        })
        return false
      }

      delete submit_data.model_name
      if (submit_data.shop_id == 0) delete submit_data.shop_id
      if (submit_data.print_id == 0) delete submit_data.print_id

      submit_data.city_id = _.CarLoanData.city_id[1]||''
      submit_data.sign = getSign(submit_data)//追加签名验证
      _.$store.commit('updateLoading', true)

      _.$http.post('/index.php/Api/CarGuaranty/save', submit_data).then((response) => {// 响应成功回调

        _.$store.commit('updateLoading', false)
        if (response.data.code == 0) {
          _.$vux.toast.show({
            text: '提交成功',
            type: 'success',
            isShowMask: true,
            position: 'middle',
            width: '9em'
          })
          setTimeout(() => _.back_home(), 2000);
        } else {
          toast_fail(response.data.msg)
        }
      }, (response) => {// 响应错误回调
        console.info('提交表单回调失败', response)

        _.$store.commit('updateLoading', false)
        toast_fail(response.data.msg)
      })

      function toast_fail(msg = '提交失败') {
        _.$vux.toast.show({
          text: msg,
          type: 'cancel',
          isShowMask: true,
          position: 'middle',
          width: '9em'
        })
      }
    },
    name_check(newVal) {
      const _ = this
      if (newVal.match(/\s+/g)) {
        let oldVal_name = _.CarLoanData.name
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          _.CarLoanData.name = oldVal_name
        })
      }
      return {valid: true}
    },
    tel_check(val) {
      const _ = this
      if (val.match(/\D+/g)) {
        let oldVal_mobile = _.CarLoanData.mobile
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          _.CarLoanData.mobile = oldVal_mobile
        })
      }
      return {valid: true}
    },
    tel_blur(val) {
      if (!reg('tel', val)) {
        document.querySelector('.tel i.weui-icon-warn').style.display=""
      } else {
        document.querySelector('.tel i.weui-icon-warn').style.display="none"
      }
    },
    model_name_check(key, is_datatime = false) {
      const _ = this
      _.$vux.toast.show({
       text: '请选择车辆型号',
       type: 'text',
       isShowMask: true,
       position: 'middle',
       width: '11em'
      })
      new Promise((resolve, reject) => {
        resolve();
      }).then(()=> {
        let date_dom = document.querySelector('.vux-datetime-value')
        _.CarLoanData[key] = ''
        is_datatime && (
          date_dom.className = date_dom.className.replace('have-value','')
        )
      })
      return {valid: false}
    },
    address_show() {
      this.temp_city_info[0] = this.CarLoanData.city_id
      this.temp_city_info[1] = this.CarLoanData.city
    },
    address_hide(is_ok) {
      const _ = this, open_city = _.$store.state.open_city.CarLoan //当前开通城市
      const no_open_city = open_city>0&&!open_city.some(v => v == _.CarLoanData.city_id[1])

      if (is_ok) { //点确定时
				if (no_open_city) {
					_.CarLoanData.city_id = this.temp_city_info[0]
					_.CarLoanData.city = this.temp_city_info[1]
					_.$vux.toast.show({
						text: '城市暂未开通',
						type: 'cancel',
						isShowMask: true,
						position: 'middle',
						width: '10em'
					})
				} else {
          _.CarLoanData.city = document.querySelector('.vux-popup-picker-value').innerText.split(' ')[1]
        }
      }
    },
  },
  watch: {
    CarLoanData: {
      handler(val) {
        const _ = this

        let copy_val = Object.assign({}, val)
        delete copy_val.name //不检测名字
        let has_empty = Object.values(copy_val).every(v => v===0||(v&&v.length>0))

        if (has_empty) {//按钮可点击
          _.submit_disabled = false
        }else {//按钮不可点击
          _.submit_disabled = true
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.page__body{
  margin: -25px 15px 0;
}
</style>
