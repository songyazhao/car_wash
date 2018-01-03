export default {
  state: {
    title: '',
    isLoading: false,
    isTransitionEnd: false//页面过渡是否完毕
  },
  mutations: {
    updateLoading (state, isLoading) {
      state.isLoading = isLoading
    },
    updateTransitionEnd (state, isTransitionEnd) {
      state.isTransitionEnd = isTransitionEnd
    },
  }
}