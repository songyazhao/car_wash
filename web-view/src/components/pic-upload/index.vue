<template>
  <div>
    <upload
      :inputOfFile="name"
      :isXhr="false"
      :crop="false"
      :max-file-size="5242880"
      @imagechanged="imagechanged">
      <div :id="name">
        <slot name="icon"></slot>
      </div>
    </upload>
  </div>
</template>

<script>
import upload from 'vue-core-image-upload'

export default {
  name: 'pic-upload',
  components: { upload },
  props: {
    name: [String]
  },
  methods: {
    imagechanged(val) {
      this.$emit('on-change', val, this.name)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
