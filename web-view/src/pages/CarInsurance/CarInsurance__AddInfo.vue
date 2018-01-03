<template>
  <div>
    <scroller ref="myScroller" :height="'-55'" lock-x scrollbar-y>
      <section id="outer" role="addinfo">
        <template v-if="has_module_1">
          <group
            title="完善信息:"
            labelWidth="6em"
            :label-color="label_color">
            <x-input
              title="受益人:"
              v-model="insurance_applicant.insured"
              placeholder="请填写受益人姓名"
              :min="2">
            </x-input>
            <x-input
              title="手机号:"
              v-model="insurance_applicant.insured_phone"
              type="tel"
              placeholder="请填写受益人手机号"
              :required="true"
              :max="11"
              :is-type="insured_phone_check">
            </x-input>
            <popup-radio
              class="papers"
              value-align="left"
              title="证件类型:"
              :options="insured_Id_type"
              v-model="insured_Id_val">
              <x-icon class="icon-arrow" type="ios-arrow-forward" size="18"></x-icon>
            </popup-radio>
            <x-input
              title="证件号码:"
              v-model="insurance_applicant.insured_Idcard"
              type="tel"
              placeholder="请填写证件号"
              :required="true">
            </x-input>
            <cell value-align="left">受益人和投保人信息一致
              <CheckList class="checker" v-model="isSelected"></CheckList>
            </cell>
          </group>

          <!-- <transition
            enter-active-class="slideDown"
            leave-active-class="slideUp"
          > -->
            <group
              v-show="!isSelected"
              gutter="10px"
              labelWidth="6em"
              :label-color="label_color">
              <x-input
                title="投保人:"
                v-model="insurance_applicant.applicant"
                placeholder="请填写投保人姓名"
                :min="2">
              </x-input>
              <x-input
                title="手机号:"
                v-model="insurance_applicant.applicant_phone"
                type="tel"
                placeholder="请填写投保人手机号"
                :required="true"
                :max="11"
                :is-type="applicant_phone_check">
              </x-input>
              <popup-radio
                class="papers"
                value-align="left"
                title="证件类型:"
                :options="applicant_Id_type"
                v-model="applicant_Id_val">
                <x-icon class="icon-arrow" type="ios-arrow-forward" size="18"></x-icon>
              </popup-radio>
              <x-input
                title="证件号码:"
                v-model="insurance_applicant.applicant_Idcard"
                type="tel"
                placeholder="请填写证件号"
                :required="true">
              </x-input>
            </group>
          <!-- </transition> -->
        </template>

        <template v-if="has_module_2">
          <div class="pic" v-show="(!has_module_1&&has_module_2) || insurance_applicant.insured_Idtype == 1">
            <div class="label c_59">上传受益人身份证：</div>
            <ul class="content">
              <li>
                <PicUpload name="insurance_pic.applicant_zheng" @on-change="pic_change">
                  <img :src="insurance_pic.applicant_zheng.replace('./', '/')" slot="icon" v-if="insurance_pic.applicant_zheng != ''">
                  <img src="../../assets/insurance/personcardz.png" slot="icon" v-else>
                </PicUpload>
                <div class="tips c_59">正面</div>
              </li>
              <li>
                <PicUpload name="insurance_pic.applicant_fan" @on-change="pic_change">
                  <img :src="insurance_pic.applicant_fan.replace('./', '/')" slot="icon" v-if="insurance_pic.applicant_fan != ''">
                  <img src="../../assets/insurance/personcardf.png" slot="icon" v-else>
                </PicUpload>
                <div class="tips c_59">反面</div>
              </li>
            </ul>
          </div>
        </template>
        <template v-if="has_module_3">
          <div class="pic" v-show="(!has_module_1&&has_module_3) || insurance_applicant.applicant_Idtype == 1">
            <div class="label c_59">上传受益人行驶证：</div>
            <ul class="content">
              <li>
                <PicUpload name="driver_pic.driver_zheng" @on-change="pic_change">
                  <img :src="driver_pic.driver_zheng.replace('./', '/')" slot="icon" v-if="driver_pic.driver_zheng != ''">
                  <img src="../../assets/insurance/drivecardz.png" slot="icon" v-else>
                </PicUpload>
                <div class="tips c_59">正本</div>
              </li>
              <li>
                <PicUpload name="driver_pic.driver_fan" @on-change="pic_change">
                  <img :src="driver_pic.driver_fan.replace('./', '/')" slot="icon" v-if="driver_pic.driver_fan != ''">
                  <img src="../../assets/insurance/drivecardf.png" slot="icon" v-else>
                </PicUpload>
                <div class="tips c_59">副本</div>
              </li>
            </ul>
          </div>
        </template>

        <group
          v-if="has_module_4"
          class="post-info"
          :style="{ paddingBottom: !has_module_5 ? '12px' : '0px' }"
          :title="has_module_4 ? '邮寄地址:' : ''"
          labelWidth="6em"
          :label-color="label_color">
          <x-input
            title="收件人:"
            v-model="post_info.receiver"
            placeholder="请填写收件人姓名"
            :min="2">
          </x-input>
          <x-input
            title="手机号:"
            v-model="post_info.tel"
            type="tel"
            placeholder="用于填写保险公司验证码"
            :required="true"
            :max="11"
            :is-type="tel_check">
          </x-input>
          <x-input
            title="邮寄地址:"
            v-model="post_info.receiver_address"
            placeholder="请填写邮寄地址"
            :min="2">
          </x-input>
        </group>
        <group
          v-if="has_module_5"
          class="email"
          :style="{ marginTop: !has_module_4 ? '12px' : '0px' }"
          gutter="0"
          labelWidth="6em"
          :label-color="label_color">
          <x-input
            title="电子邮箱:"
            v-model="post_info.email"
            placeholder="请填写电子邮箱地址"
            :required="true">
          </x-input>
        </group>
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
import { querystring, Scroller, Group, XButton, XInput, PopupRadio, Cell } from 'vux'
import { CheckList, PicUpload } from '@/components'
// import { mapState } from 'vuex'
// import { animate } from '@/utils'
import { reg } from '@/utils'

const typeArr = ['身份证', '组织机构代码证', '护照', '军官证', '港澳回乡证或台胞证', '其他']
let params = querystring.parse(decodeURI(location.search))
let SupplementInfo = params.SupplementInfo ? params.SupplementInfo.split(',') : ['1', '2', '3', '4'] // 表示要显示该模块 1受益人信息 2身份证照片 3行驶证照片 4邮寄信息

export default {
  name: 'CarInsurance__AddInfo',
  components: {
    Scroller, Group, XButton, XInput, PopupRadio, Cell,
    CheckList, PicUpload
  },
  data() {
    return {
      has_module_1: SupplementInfo.indexOf('1') > -1,
      has_module_2: SupplementInfo.indexOf('2') > -1,
      has_module_3: SupplementInfo.indexOf('3') > -1,
      has_module_4: SupplementInfo.indexOf('4') > -1,
      has_module_5: SupplementInfo.indexOf('5') > -1,
      order_sn: params.order_sn,
      submit_disabled: true,
      isSelected: true,                // 投保人受益人是否一致 会根据insurance_applicant.insured_eq_applicant变化
      label_color: '#A1A1A1',
      old_applicant_phone: '',
      old_insured_phone: '',
      applicant_Id_val: '身份证',
      applicant_Id_type: typeArr,
      insured_Id_val: '身份证',
      insured_Id_type: typeArr,
      insurance_applicant: {           // 投保人/受益人 信息
        insured_eq_applicant: 1,       // 投保人受益人是否一致 1一致 0不一致
        applicant: '',                 // 投保人名字
        insured: '',                   // 受益人名字
        applicant_phone: '',           // 投保人手机号
        insured_phone: '',             // 受益人手机号
        applicant_Idcard: '',          // 投保人证件号
        insured_Idcard: '',            // 受益人证件号
        applicant_Idtype: 1,           // 投保人证件类型 1：身份证 2: 组织机构代码证 3：护照 4：军官证 5：港澳回乡证或台胞证 6：其他
        insured_Idtype: 1              // 受益人证件类型
      },
      insurance_pic: {                 //投保人身份证照片(base64)
        applicant_zheng: '',
        applicant_fan: '',
      },
      driver_pic: {                    //驾驶证照片(base64)
        driver_zheng: '',
        driver_fan: '',
      },
      post_info: {                     // 邮寄信息
        receiver: '',                  // 收件人
        tel: '',                       // 收件人手机号
        receiver_address: '',          // 收件人地址
        email: ''                      // 收件人邮箱
      }
    }
  },
  watch: {
    isSelected(val) {
      this.insurance_applicant.insured_eq_applicant = ~~val

      if (val) this.$nextTick(() => this.$refs.myScroller.reset({top: 0}))
      else this.$nextTick(() => this.$refs.myScroller.reset())
    },
    applicant_Id_val(val) {
      this.insurance_applicant.applicant_Idtype = this.applicant_Id_type.indexOf(val) + 1
    },
    insured_Id_val(val) {
      this.insurance_applicant.insured_Idtype = this.insured_Id_type.indexOf(val) + 1
    },
    insurance_applicant: {
      deep: true,
      handler() {
        this.submit_disabled = this.is_submit()
      }
    },
    insurance_pic: {
      deep: true,
      handler() {
        this.submit_disabled = this.is_submit()
      }
    },
    driver_pic: {
      deep: true,
      handler() {
        this.submit_disabled = this.is_submit()
      }
    },
    post_info: {
      deep: true,
      handler() {
        this.submit_disabled = this.is_submit()
      }
    }
  },
  created () {
    // 如果之前填过信息 就带过来
    this.$store.commit('updateLoading', true)
    this.$http.post('/index.php/Xiaochengxu/CarInsurance/getSupplementInfo', { order_sn: this.order_sn })
      .then((res) => {
        this.$store.commit('updateLoading', false)
        res = res.data
        const data = res.data

        if (res.code == 0) {
          if (!~~data.insurance_applicant.applicant_Idtype)
            data.insurance_applicant.applicant_Idtype = 1
          if (!~~data.insurance_applicant.insured_Idtype)
            data.insurance_applicant.insured_Idtype = 1
          this.insurance_applicant = data.insurance_applicant
          this.insurance_pic = data.insurance_pic
          this.driver_pic = data.driver_pic
          this.post_info = data.post_info
        } else
          this.toastFail(res.msg)
      })
  },
  mounted () {
    // animate.slide(4 * 53) // 53是每个cell组件实际渲染出来的高
  },
  methods: {
    applicant_phone_check(val) {
      if (val.match(/\D+/g)) {
        let old_applicant_phone = this.insurance_applicant.applicant_phone
        Promise.resolve().then(() => this.insurance_applicant.applicant_phone = old_applicant_phone)
      }
      return {valid: true}
    },
    insured_phone_check(val) {
      if (val.match(/\D+/g)) {
        let old_insured_phone = this.insurance_applicant.insured_phone
        Promise.resolve().then(() => this.insurance_applicant.insured_phone = old_insured_phone)
      }
      return {valid: true}
    },
    tel_check(val) {
      if (val.match(/\D+/g)) {
        let old_tel = this.post_info.tel
        Promise.resolve().then(() => this.post_info.tel = old_tel)
      }
      return {valid: true}
    },
    pic_change(val, name) {
      let reader = new FileReader()
      reader.readAsDataURL(val)
      setTimeout( () => {
        let key = name.split('.')
        this.$el.querySelector(`[id="${name}"] img`).src = reader.result
        this[key[0]][key[1]] = reader.result
      }, 300)
    },
    is_submit() { // 是否满足提交的条件 用来控制按钮是否能点击
      let insurance_applicant = Object.assign({}, this.insurance_applicant)
      for (let key in insurance_applicant)
        if (this.isSelected && key.indexOf('applicant') > -1)
          delete insurance_applicant[key]

      let insurance_pic = Object.assign({}, this.insurance_pic)
      if (insurance_applicant.insured_Idtype != 1)
        insurance_pic = false

      let post_info = Object.assign({}, this.post_info)
      if (!this.has_module_5)
        delete post_info['email']

      let arr = [
        ...this.has_module_1 && Object.values(insurance_applicant),
        ...this.has_module_2 && Object.values(insurance_pic),
        ...this.has_module_3 && Object.values(this.driver_pic),
        ...this.has_module_4 && Object.values(post_info)
      ]
      return arr.some(v => v === '')
    },
    form_submit() {
      if (this.has_module_1) {
        if (!reg('tel', this.insurance_applicant.insured_phone))
          return this.toastFail('请输入正确的手机号', 13)

        if (!this.isSelected) { // 投保/受益人不一致
          if (!reg('tel', this.insurance_applicant.applicant_phone))
            return this.toastFail('请输入正确的手机号')
        }
      }
      if (this.has_module_4) {
        if (!reg('tel', this.post_info.tel))
          return this.toastFail('请输入正确的收件人手机号', 16)
      }
      if (this.has_module_5)
        if (!reg('email', this.post_info.email))
          return this.toastFail('请输入正确的邮箱地址', 14)

      let insurance_applicant = Object.assign({}, this.insurance_applicant)
      if (this.isSelected) { // 投保人/受益人一致的话 自动填充受益人信息
        insurance_applicant.applicant = insurance_applicant.insured
        insurance_applicant.applicant_phone = insurance_applicant.insured_phone
        insurance_applicant.applicant_Idcard = insurance_applicant.insured_Idcard
        insurance_applicant.applicant_Idtype = insurance_applicant.insured_Idtype
      }

      let data = {
        order_sn: this.order_sn,
        insurance_applicant,
        insurance_pic: this.insurance_pic,
        driver_pic: this.driver_pic,
        post_info: this.post_info
      }

      this.$store.commit('updateLoading', true)
      this.$http.post('/index.php/Xiaochengxu/CarInsurance/userSupplementInfo', data)
        .then((res) => {
          this.$store.commit('updateLoading', false)
          res = res.data
          const data = res.data

          if (res.code == 0)
            this.$router.replace({ name: 'CarInsurance__Result', params: { hideFlow: true } })
          else
            this.toastFail(res.msg)
        })
    }
  }
}
</script>

<style>
[role="addinfo"] .weui-cells__title {
  margin-top: 6px;
}
[role="addinfo"] .weui-cells__title , .papers .weui-cell__ft {
  color: #595959;
}
.g-core-image-upload-form {
  height: auto!important;
}
</style>

<style lang="less" scoped>
.weui-cell {
  height: 53px;
  padding-right: 22px!important;
  box-sizing: border-box;
}
.papers {
  color: #A1A1A1;
  .icon-arrow {
    fill: #595959;
    transform: rotateZ(90deg);
    position: absolute;
    right: 2px;
    top: 0;
  }
}
.checker {
  position: absolute;
  top: 16px;
  right: 25px;
  width: 20px;
  height: 20px;
}
.label {
  padding: 8px 15px;
}
.pic {
  .content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: white;
    padding-top: 15px;
    img {
      width: 160px;
      height: 95px;
    }
    .tips {
      text-align: center;
      margin-top: 12px;
      margin-bottom: 6px;
    }
  }
}
.post-info {
  position: relative;
}
.email {
  padding-bottom: 50px;
  &::after {
    content: '*此邮箱作为接收和查询电子保单使用，务必认真填写。';
    color: #A1A1A1;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: -32px;
    text-align: center;
  }
}
</style>


