<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    @after-enter="$emit('transition-end')"
    @after-leave="$emit('transition-end')">
    <div class="mask" v-show="value" :style="{ background }"></div>
  </transition>
</template>

<script>
export default {
  name: 'shade',
  props: ['value', 'background']
}
</script>
