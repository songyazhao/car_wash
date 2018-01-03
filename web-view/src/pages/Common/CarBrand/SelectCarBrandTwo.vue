<template>
  <div>
    <XHeader v-if="$store.state.isAndroid">{{$route.meta.title}}</XHeader>
    <scroller ref="myScroller" :height="$store.state.isAndroid?'-46':''" lock-x scrollbar-y enable-horizontal-swiping>
      <div class="page__list">
        <group
          class="carbrand_title"
          v-for="(items, index) in brand_list"
          :key="index"
          :title="items.year"
        >
          <cell
            v-for="item in items.car"
            :key="item.detail_model_id"
            :title="item.detail_model_name"
            :is-link="true"
            @click.native="data_updata(item.detail_model_id, item.detail_model_name)"
          >
          </cell>
        </group>
      </div>
    </scroller>
  </div>
</template>

<script>
import { XHeader, Scroller, Group, Cell } from 'vux'

export default {
  name: 'CarBrandTwo',
  components: {
    XHeader, Scroller, Group, Cell
  },
  data () {
    return {
      params: this.$route.params,//获取上个页面传过来参数
      brand_list: [],
      status: {
        pullupStatus: 'default'
      }
    }
  },
  mounted() {
    const _ = this

    _.$store.commit('updateLoading', true)
    _.$http.get('/index.php/Xiaochengxu/SecondHand/getChildModelsList?model_id=' + _.params.model_id).then((response) => {// 响应成功回调
      _.$store.commit('updateLoading', false)

      if (response.data.code === 0) {
        _.brand_list = response.data.data//更新列表

        _.$nextTick(() => {
          _.$refs.myScroller.reset()
        })
      } else {
        console.warn('拉取车系三级信息失败', response)
      }
    }, (response) => {// 响应错误回调
      console.warn('拉取车系三级信息失败', response)
    })
  },
  methods: {
    data_updata(detail_model_id, detail_model_name) {
      const _ = this, name = _.$route.params.ParentPage

      _.$store.state[name + 'Data']['model_name'] = _.params.name+ '/' +detail_model_name
      _.$store.state[name + 'Data']['detail_model_id'] = detail_model_id
      _.$router.go(-2)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
