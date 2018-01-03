<template>
  <div>
    <XHeader v-if="$store.state.isAndroid">{{$route.meta.title}}</XHeader>
    <scroller
      ref="myScroller"
      :height="$store.state.isAndroid?'-46':''"
      lock-x
      scrollbar-y
      enable-horizontal-swiping
    >
      <div class="page__list">
        <Group
          v-if="record_list.length>0"
          :title="$route.params.license_number"
        >
          <Cell
            v-for="(item, index) in record_list"
            :key="index"
            :is-link="true"
          >
            <img src="../../assets/CLGL_CL_icon.png" slot="icon">
            <span slot="after-title" class="label">
              <div class="c_59">{{ item.shop_name }}</div>
              <div class="c_a1">{{ item.addtime }}</div>
            </span>
          </Cell>
        </Group>
        <NoList v-if="isLoad" :list="record_list" text="该车辆暂无进店记录"/>
      </div>
    </scroller>
  </div>
</template>

<script>
import { XHeader, Scroller, Group, Cell } from 'vux'
import { getSign } from '@/utils'
import { NoList } from '@/components'

export default {
  name: 'CarManage__ToShopRecord',
  components: {
    XHeader,
    Scroller,
    Group,
    Cell,
    NoList
  },
  data () {
    return {
      isLoad: false,
      record_list: []
    }
  },
  created() {
    const _ = this, params = _.$route.params

    params.sign = getSign(params)//追加签名验证

    _.$store.commit('updateLoading', true)
    _.$http.post('/index.php/Api/BindLicense/carHistory', params).then((response) => {// 响应成功回调
      _.$store.commit('updateLoading', false)

      if (response.data.code === 0) {
        _.record_list = response.data.data.rows//更新列表
        _.$nextTick(() => {
          _.$refs.myScroller.reset()
        })
      } else {
        _.$vux.toast.show({
          text: response.data.msg,
          type: 'cancel',
          isShowMask: true,
          position: 'middle',
          width: '9em'
        })
      }
      _.isLoad = true
    }, (response) => {
      _.isLoad = true
      console.warn('获取到店记录失败:', response)
    })
  },
  mounted() {
    if (this.record_list.length>0)
      document.querySelector('.weui-cells__title').style.paddingLeft = 0
  }
}
</script>

<style lang="less" scoped>
.page__list{
  padding: 0 10px;
  .weui-cell{
    height: 62px;
    padding-right: 0!important;
    box-sizing: border-box;
    &::before {
      right: 15px;
    }
  }
  img{
    width: 42px;
    height: 42px;
  }
  .label {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .c_a1 {
      padding-top: 3px;
    }
  }
}
</style>
