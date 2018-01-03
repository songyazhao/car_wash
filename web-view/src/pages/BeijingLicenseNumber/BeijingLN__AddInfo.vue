<template>
  <div>
    <scroller ref="myScroller" :height="'-55'" lock-x scrollbar-y>
      <div class="page__head">
        <Numberitem :text="$route.params.number" selected disabled></Numberitem>
      </div>
      <div class="page__content">
        <div class="title">请填写申请人信息</div>
        <group
          gutter="0"
          labelWidth="6em">
          <x-input
            title="姓名:"
            v-model="form.name"
            text-align="right"
            placeholder-align="right"
            placeholder="请填写申请人姓名（必填）">
          </x-input>
          <x-input
            title="电话:"
            v-model="form.phone"
            type="tel"
            text-align="right"
            placeholder-align="right"
            placeholder="请填写申请人电话（必填）"
            :required="true"
            :max="11"
            :is-type="phone_check">
          </x-input>
        </group>
      </div>
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
import { Scroller, Group, XButton, XInput } from 'vux'
import Numberitem from './components/Numberitem'
import { reg } from '@/utils'

export default {
  name: 'BeijingLN__AddInfo',
  components: {
    Scroller, Group, XButton, XInput,
    Numberitem
  },
  data() {
    let params = this.$route.params
    let identifier = params.id||''
    let LicenseNumber = params.number||''

    return {
      submit_disabled: true,
      form: {
        identifier,
        phone: '',
        name: '',
        LicenseNumber,
        openId: this.$store.state.openid
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(obj) {
        this.submit_disabled = Object.values(obj).some(v => v === '')
      }
    }
  },
  methods: {
    phone_check(val) {
      if (val.match(/\D+/g)) {
        let old_phone = this.form.phone
        Promise.resolve().then(() => this.form.phone = old_phone)
      }
      return {valid: true}
    },
    form_submit() {
      if (!reg('tel', this.form.phone))
        return this.toastFail('请输入正确的手机号', 13)

      let submit_data = Object.assign({}, this.form)
      submit_data.sign = this.getSign(submit_data)//追加签名验证
      this.$store.commit('updateLoading', true)
      this.$http.post('/index.php/Xiaochengxu/CaiYun/setInfo', submit_data)
        .then(res => {
          this.$store.commit('updateLoading', false)
          res = res.data
          if (res.code == 0)
            this.$router.push({name: 'BeijingLN__Result'})
          else
            this.toastFail(res.msg)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.page__head {
  font-size: 30px;
  text-align: center;
  margin-top: 15px;
  .number {
    width: 181px;
    line-height: 60px;
    border-radius: 5px;
  }
}
.page__content {
  margin: 0 15px;
  .title {
    margin-top: 12px;
    margin-bottom: 8px;
  }
  .weui-cell::before{left: 0}
}
</style>