<template>
  <div class="default-checkbox" :class="{'selected-checkbox': isSelected}" @click="isSelected = !isSelected"></div>
</template>

<script>
export default {
  name: 'check-list',
  components: {},
  props: {
    value: [Boolean]
  },
  data() {
    return {
      isSelected: this.value
    }
  },
  watch: {
    isSelected(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
.default-checkbox {
  display: inline-block;
  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
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
