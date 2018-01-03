<template>
  <div>
    <XHeader v-if="$store.state.isAndroid">{{$route.meta.title}}</XHeader>
    <scroller ref="myScroller" :height="$store.state.isAndroid?'-101':'-55'" lock-x scrollbar-y enable-horizontal-swiping>
      <section>
        <div class="page__head">
          <img src="../../assets/TJCL_TP.png">
        </div>
        <div class="page__body">
          <div class="placeholder">让车后服务 随心所遇</div>
          <LicenNumberInput
            ref="LicenNumberInput"
            v-model="license_number"
            @on-change="input_change"
          />
          <Checker
            default-item-class="default-checkbox"
            :selected-item-class="selectedItemClass"
            v-model="isReceive"
          >
            <CheckerItem
              class="placeholder"
              :value="isReceive"
              @on-item-click="checkerToggle"
            >
              接收该车辆电子打印单
            </CheckerItem>
          </Checker>
        </div>
      </section>
    </scroller>
    <ProvinceItem/>
    <div class="page__footer">
      <x-button
        text="确定"
        @click.native="onConfirm"
        :disabled="submit_disabled"
      />
    </div>
  </div>
</template>

<script>
import { XHeader, Scroller, Checker, CheckerItem, XButton } from 'vux'
import { LicenNumberInput } from '@/components'
import { getSign } from '@/utils'

export default {
  name: 'CarManage__EditCar',
  components: {
    XHeader,
    Scroller,
    Checker,
    CheckerItem,
    XButton,
    LicenNumberInput: LicenNumberInput.LicenNumberInput,
    ProvinceItem: LicenNumberInput.ProvinceItem
  },
  data () {
    return {
      isReceive: 1,
      submit_disabled: true,
      license_number: ''
    }
  },
  computed: {
    selectedItemClass() {
      return this.isReceive == 1 ? 'selected-checkbox' : ''
    }
  },
  mounted() {
    const _ = this

    if (_.$route.params.type === 'edit') {
      _.license_number = _.$route.params.license_number
      _.$refs.LicenNumberInput.province_text = _.$route.params.license_number.substr(0, 1)
      _.$refs.LicenNumberInput.licenseNumberTemp = _.$route.params.license_number.substr(1)
      _.isReceive = _.$route.params.isReceive
      _.id = _.$route.params.id
    } else if (_.$route.params.type === 'add') {}

    _.$nextTick(() => {
      _.$refs.myScroller.reset()
    })
  },
  methods: {
    input_change(val) {
      if (val.length > 6) {//按钮可点击
        this.submit_disabled = false
      }else {//按钮不可点击
        this.submit_disabled = true
      }
    },
    onConfirm() {
      const _ = this, type = _.$route.params.type
      let params = {
        license_number: _.license_number,
        type: _.isReceive
      }, actions = {
        add: 'addLicense',
        edit: 'editLicense'
      }

      if (_.$route.params.type === 'edit') params.id = _.id

      params.sign = getSign(params)//追加签名验证

      _.$store.commit('updateLoading', true)
      _.$http.post('/index.php/Api/BindLicense/' + actions[type], params).then((response) => {// 响应成功回调
        _.$store.commit('updateLoading', false)

        if (response.data.code === 0) {
          _.$vux.toast.show({
            text: response.data.msg,
            type: 'success',
            isShowMask: true,
            position: 'middle',
            width: '9em',
            onHide() {
              new Promise((resolve, reject) => {
                resolve();
              }).then(() => {
                _.$router.go(-1)
              })
            }
          })
        } else {
          _.$vux.toast.show({
            text: response.data.msg,
            type: 'cancel',
            isShowMask: true,
            position: 'middle',
            width: '9em'
          })
        }
      }, (response) => {
        console.warn('编辑车辆信息失败:', response)
      })
    },
    checkerToggle(value, disabled) {
      this.isReceive = value == 0 ? 1 : 0
    }
  }
}
</script>

<style lang="less" scoped>
.page__head{
  height: 150px;
  display: flex;
  padding-top: 60px;
  align-items: center;
  justify-content: center;
  img{
    width: 56%;
    margin-left: -2.5%;
  }
}
.page__body {
  margin: 0 28px;
  .placeholder {
    text-align: center;
    color: #808080;
    font-size: 12px;
    line-height: 22px;
    padding-bottom: 8px;
  }
  .vux-checker-box .placeholder{
    padding-top: 8px;
  }
  .default-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
    &:before {
      content: '';
      display: block;
      width: 12px;
      height: 12px;
      margin-right: 8px;
      background: url(../../assets/TJCL_JS_WQD.png) no-repeat;
      background-size: 100%;
    }
  }
  .selected-checkbox {
    &:before {
      background: url(../../assets/TJCL_JS_QD.png) no-repeat;
      background-size: 100%;
    }
  }
}
.page__footer {
  width: 100%;
  display: flex;
  align-items: center;
  button{
    width: 100%;
    height: 55px;
    line-height: 43px;
    background-color: #FB0;
    font-size: 15px;
    color: white;
    border: none;
    &[disabled="disabled"]{
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .weui-btn{
    border-radius: 0;
    &::after{
      display: none;
    }
  }
}
</style>
