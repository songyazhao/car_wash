<template>
  <div>
    <scroller
      ref="myScroller"
      height="-55"
      lock-x
      scrollbar-y
      enable-horizontal-swiping>
      <section>
        <div class="page__head">
          <img class="banner" src="../../assets/carused_banner.png">
        </div>

        <div class="page__body">

          <group
            class="panel_1"
            gutter="0"
            labelWidth="6em"
            :label-color="label_color">
            <x-address
              title="所在城市:"
              v-model="CarUsedData.city_id"
              :list="address"
              placeholder="请选择您所在地区"
              value-text-align="right"
              :hide-district="true"
              @on-show="address_show"
              @on-hide="address_hide">
            </x-address>
            <x-input
              class="carbrand weui-cell_access"
              title="车辆品牌:"
              v-model="CarUsedData.model_name"
              placeholder="请选择品牌&车型"
              :readonly="true"
              :text-align="input_align"
              :placeholder-align="input_align">
              <router-link
                slot="right"
                :to="{name: 'CarBrandOne', params: {ParentPage: $route.name}}"
                style="position:absolute;right:-1em;top:-2em;width:19em;height:4em;">
              </router-link>
            </x-input>
            <x-input
              title="车主电话:"
              v-model="CarUsedData.mobile"
              type="tel"
              placeholder="请填写车主电话"
              :required="true"
              :max="11"
              :text-align="input_align"
              :placeholder-align="input_align"
              :is-type="tel_check"
              @on-blur="tel_blur">
            </x-input>
            <x-input
              title="车主姓名:"
              v-model="CarUsedData.name"
              placeholder="请填写车主姓名(选填)"
              :min="2"
              :text-align="input_align"
              :placeholder-align="input_align"
              :is-type="name_check">
            </x-input>
          </group>

					<Radio
						class="quotes_radio"
						label="获取车辆估值"
						align="right"
						:isChecked="CarUsedData.isQuotes"
						@check-toggle="checkeToggle"
					/>

					<transition
						enter-active-class="animated rotateInUpRight"
						leave-active-class="animated rotateOutDownRight"
            @after-enter="myScrollerReset"
            @after-leave="myScrollerReset">
						<group
							v-show="CarUsedData.isQuotes"
							gutter="0"
							class="panel_2"
							labelWidth="6em"
							:label-color="label_color">
							<datetime
                class="card-time"
								title="上牌时间:"
								v-model="CarUsedData.card_time"
								format="YYYY-MM"
								year-row="{value}年"
								month-row="{value}月"
								:startDate="start_date"
								:endDate="end_date"
								valueTextAlign="right"
								placeholder="请选择上牌时间"
								confirm-text="完成"
								cancel-text="取消"
								@on-change="date_change">
							</datetime>
							<x-input
								title="表显里程:"
								v-model="CarUsedData.mileage"
								type="tel"
								placeholder="请输入里程数"
								:max="5"
								:text-align="input_align"
								:placeholder-align="input_align"
								:is-type="mileage_check">
								<span
									slot="right"
									:style="{color: label_color, paddingLeft: '5px'}">
									万公里
								</span>
							</x-input>
						</group>
					</transition>

        </div>
      </section>
    </scroller>
    <div class="page__footer">
      <x-button
        text="提交信息"
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
	Group, XInput, XButton, Datetime, XAddress, CellBox
} from 'vux'
import { Radio } from '@/components'
import { reg } from '@/utils'
import { mapState } from 'vuex'

export default {
  name: 'CarUsed',
  components: {
    XHeader, Scroller,
    Flexbox, FlexboxItem,
    Grid, GridItem,
		Group, XInput, XButton, Datetime, XAddress, CellBox,
		Radio
  },
  data() {
    const carbrand = this.$route.params.model_name||''
    const carbrand_id = this.$route.params.detail_model_id||''
    return {
      start_date: '2007-01-01',
      end_date: new Date().getFullYear() + '-12-01',
			temp_city_info: [],
      submit_disabled: true,
      CarUsedData: {},
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
    this.CarUsedData = this.$store.state.CarUsedData;//获取组件间共享的数据
    this.myScrollerReset()
  },
  methods: {
    form_submit() {//表单提交事件
			const _ = this
			let submit_data = Object.assign({}, _.CarUsedData)

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

      submit_data.city_id = _.CarUsedData.city_id[1]||''
      submit_data.sign = _.getSign(submit_data)//追加签名验证
      this.$store.commit('updateLoading', true)

      _.$http.post('/index.php/Xiaochengxu/SecondHand/sellingCar', submit_data)
      .then((response) => {// 响应成功回调

        this.$store.commit('updateLoading', false)
        if (response.data.code == 0) {//提交成功
          this.$router.replace({
            name: 'CarUsed__Result',
            params: {car_info: response.data.data}
          })
        } else if (response.data.code == 2) {
          toast_fail('信息输入有误')
        } else {
          toast_fail(response.data.msg)
        }
      }, (response) => {// 响应错误回调
        console.info('提交表单回调失败', response)

        this.$store.commit('updateLoading', false)
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
        let oldVal_name = _.CarUsedData.name
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          _.CarUsedData.name = oldVal_name
        })
      }
      return {valid: true}
    },
    tel_check(val) {
      const _ = this
      if (val.match(/\D+/g)) {
        let oldVal_mobile = _.CarUsedData.mobile
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          _.CarUsedData.mobile = oldVal_mobile
        })
      }
      return {valid: true}
    },
    tel_blur(val) {
      if (!reg('tel', val)) {
        document.querySelectorAll('.weui-icon-warn')[2].style.display=""
      } else {
        document.querySelectorAll('.weui-icon-warn')[2].style.display="none"
			}
    },
    carbrand_check(key, is_datatime = false) {
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
        _.CarUsedData[key] = ''
      })
      return {valid: false}
    },
    mileage_check(val) {
      const _ = this
      if (_.CarUsedData.model_name == '') {
        return _.carbrand_check('mileage')
      }

      if (!reg('km', val)) {
        let oldVal_mileage = _.CarUsedData.mileage
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          _.CarUsedData.mileage = oldVal_mileage
        })
      }
      return {valid: true}
    },
    date_change(newVal) {
      const _ = this

      let current_date = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1)<10?'0' + (new Date().getMonth() + 1).toString():(new Date().getMonth() + 1));

      if (newVal.replace('-', '') > current_date.replace('-', '')) {
        _.$vux.toast.show({
         text: '不能大于当前时间',
         type: 'text',
         isShowMask: true,
         position: 'middle',
         width: '12em'
        })

        let oldVal_card_time = _.CarUsedData.card_time
        new Promise((resolve, reject) => {
          resolve();
        }).then(() => {
          _.CarUsedData.card_time = oldVal_card_time
        });
        return false
      }
    },
		address_show() {
			this.temp_city_info[0] = this.CarUsedData.city_id
			this.temp_city_info[1] = this.CarUsedData.city
		},
    address_hide(is_hide) {
			const _ = this, open_city = _.$store.state.open_city.CarUsed //当前开通城市
			const no_open_city = open_city.length>0&&!open_city.some(v => v == _.CarUsedData.city_id[1])

      if (is_hide) { //点确定时
				if (no_open_city) {
					_.CarUsedData.city_id = this.temp_city_info[0]
					_.CarUsedData.city = this.temp_city_info[1]
					_.$vux.toast.show({
						text: '城市暂未开通',
						type: 'cancel',
						isShowMask: true,
						position: 'middle',
						width: '10em'
					})
				} else {
					_.CarUsedData.city = document.querySelector('.vux-popup-picker-value').innerText.split(' ')[1]
				}
      }
		},
    checkeToggle(value, disabled) {
			this.CarUsedData.isQuotes = value == 0 ? 1 : 0
			if (this.CarUsedData.isQuotes) {
				this.$store.state.CarUsedData.card_time = ''
				this.$store.state.CarUsedData.mileage = ''
			}
    },
    myScrollerReset() {
      this.$nextTick(() => {
        this.$refs.myScroller.reset()
      })
    }
  },
  watch: {
    CarUsedData: {
      handler(val) {
				const _ = this
				let copy_val = Object.assign({}, val)

				delete copy_val.name
				if (!_.CarUsedData.isQuotes) {
					delete copy_val.card_time
					delete copy_val.mileage
				}
				let has_empty = Object.values(copy_val).every(v => typeof(v)==='number'||(v&&v.length>0))
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

<style>
.vux-popup-picker-value,
.card-time .vux-cell-value {
  color: black!important
}
</style>
<style lang="less" scoped>
.weui-cell{
  &::before{left: 0}
}
.weui-btn{
  border-radius: 0;
  &::after{
    display: none;
  }
}
.page__body {
	margin: -25px 15px 0;
	.quotes_radio{
		padding: 13px;
  }
  .panel_2 {
    padding-bottom: 15px;
  }
}
</style>
