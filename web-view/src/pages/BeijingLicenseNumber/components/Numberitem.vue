<template>
  <div class="number" :style="style">
    <div v-if="disabled">
      {{ text }}
    </div>
     <div v-else @click="$emit('input', !value)">
      {{ text }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'NumberItem',
  props: {
    text: { // 车牌号
      type: String,
      require: true
    },
    disabled: { // 禁用点击
      type: Boolean,
      default: false
    },
    selected: { // 默认是否选中
      type: Boolean,
      default: false
    },
    value: { // 父组件v-model是双向绑定, 传此值时 父组件的selected属性会失效
      default: false
    }
  },
  computed: {
    style() {
      let isSelected = this.value||this.selected
      return isSelected && { color: 'white', background: '#fb0', borderColor: 'transparent' }
    }
  }
}
</script>


<style lang="less" scoped>
.number {
  width: 100%;
  height: 100%;
  text-align: center;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #F1F1F1;
  overflow: hidden;
}
</style>

