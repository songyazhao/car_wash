<template>
  <Checker
    default-item-class="default-checkbox"
    :selected-item-class="selectedItemClass"
    :style="{textAlign: align}"
    v-model="isChecked">
    <CheckerItem
      :value="isChecked"
      @on-item-click="checkerToggle">
      <span>
        {{ label }}
        <slot></slot>
      </span>
    </CheckerItem>
  </Checker>
</template>

<script>
import { Checker, CheckerItem } from 'vux'

export default {
  name: 'radio',
  components: {
    Checker, CheckerItem
  },
  props: {
    isChecked: {
      type: [Number, String],
      default: 0
    },
    align: {
      type: String,
      default: 'left' // left|center|right
    },
    label: {
      type: String
    }
  },
  computed: {
    selectedItemClass() {
      return this.isChecked == 1 ? 'selected-checkbox' : ''
    }
  },
  methods: {
    checkerToggle(value, disabled) {
      this.$emit('check-toggle', value, disabled)
    }
  }
}
</script>


<style lang="less" scoped>
  .vux-checker-box {
    line-height: 13px;
    width: 100%;
    box-sizing: border-box;
  }
  .default-checkbox {
    color: #808080;
    display: inline-block;
    &:before {
      content: '';
      float: left;
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
</style>
