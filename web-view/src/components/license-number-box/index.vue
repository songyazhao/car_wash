<template>
  <div>
    <section class="query-box">
      <x-input
        :max="6"
        v-model="licenseNumberTemp"
        @on-change="on_change"
      >
        <x-button
          slot="label"
          class="province_button"
          :text="province_text"
          @click.native="province_items_toggle(true)">
        </x-button>
        <i slot="right" class="icon"></i>
      </x-input>
    </section>
  </div>
</template>

<script>
import { XInput, XButton } from 'vux'

const province_items = ['京','沪','浙','苏','粤','鲁','晋','冀','豫','川','渝','辽','吉','黑','皖','鄂','湘','赣','闽','陕','甘','宁','蒙','津','贵','云','桂','琼','青','新','藏']
export default {
  name: 'LicenNumberInput',
  components: {
    XInput, XButton
  },
  data() {
    return {
      submit_disabled: true,
      province_text: '京',
      province_items,
      is_province_items_show: false,
      licenseNumberTemp: ''
    }
  },
  computed: {
    _licenseNumber() {
      return this.province_text + this.licenseNumberTemp.toUpperCase()
    }
  },
  mounted() {
    const _ = this
    let OID = document.querySelector('.icon').outerHTML.match(/(data-v-[0-9a-zA-Z]{8})/)[0]
    document.querySelector('.query-box .weui-cell input').setAttribute(OID, '')
    document.querySelector('.query-box .weui-cell .weui-cell__ft').setAttribute(OID, '')
  },
  methods: {
    on_change(val) {
      this.licenseNumberTemp = val.toUpperCase()
    },
    province_items_toggle(bool) {
      this.is_province_items_show = bool
    },
    select_province(item) {
      this.province_text = item
      this.province_items_toggle(false)
    }
  },
  watch: {
    _licenseNumber(val) {
      this.$emit('on-change', val)
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
.query-box{
  background-color: white;
  .weui-cell{
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
    &::before{left: 0}
  }
  .weui-btn{
    border-radius: 0;
    &::after{
      display: none;
    }
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
</style>
