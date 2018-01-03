<template>
  <div>
    <scroller ref="myScroller" height="-55" lock-x scrollbar-y enable-horizontal-swiping>
      <div class="page__list">
        <transition-group
          enter-active-class="animated flipInX"
          leave-active-class="animated fadeOutLeft"
        >
          <LeftSlider
            ref="LeftSlider"
            direction="horizontal"
            align="right"
            @slide-change-start="onSlideChangeStart"
            v-for="(item, index) in LeftSliderList"
            v-if="item"
            :key="index"
            :data-index="index"
            :style="{ 'z-index': currentIndex==index ? 11 : 'auto' }"
          >
            <div class="slider-label c_59" @click="toShopRecord(item)">
              <img src="../../assets/CLGL_CL_icon.png">
              <span>{{ item.license_number }}</span>
            </div>
            <div class="slider-button">
              <div role="edit" @click="onEdit('edit', item)">编辑</div>
              <div role="delete" @click="onDelete(item.id, index)">解绑</div>
            </div>
          </LeftSlider>
        </transition-group>

        <div
          class="mask"
          :style="{ height: $store.state.clientH+'px' }"
          v-show="hasDelButton"
          @touchstart="onSlideReset"
        >
        </div>
        <NoList v-if="isLoad" :list="LeftSliderList" text="暂无车辆信息"/>
      </div>
    </scroller>
    <div class="page__footer">
      <x-button text="添加车辆" @click.native="onEdit('add')"></x-button>
    </div>
  </div>
</template>

<script>
import { Scroller, XButton } from 'vux'
import LeftSlider from 'vue-plain-slider'
import { NoList } from '@/components'
import { getSign } from '@/utils'

export default {
  name: 'CarManage',
  components: {
    Scroller,
    XButton,
    LeftSlider,
    NoList
  },
  data () {
    return {
      isLoad: false,
      currentIndex: 0,
      hasDelButton: false,
      isTransitionEnd: true,
      LeftSliderList: []
    }
  },
  created() {
    const _ = this

    _.$store.state.isGetId && _.$store.commit('get_id', true)

    _.$store.commit('updateLoading', true)
    _.$http.post('/index.php/Api/BindLicense/carList', {
      openid: _.$store.state.openid
    }).then((response) => {// 响应成功回调
      _.$store.commit('updateLoading', false)

      if (response.data.code === 0) {
        _.LeftSliderList = response.data.data//更新列表
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
      console.warn('获取车辆列表失败:', response)
    })
  },
  methods: {
		onSlideChangeStart (currentPage, el) {
      this.currentIndex = el.dataset['index']

      if (currentPage === 2)
        this.hasDelButton = true
      else if (currentPage === 1)
        this.hasDelButton = false
    },
    onSlideReset() { //滑块重置
      this.hasDelButton = false
      this.$refs.LeftSlider[this.currentIndex].setPage(1)
    },
    onEdit(type, item) {
      let params = { type }
      if (type === 'edit') {
        params.id = item.id
        params.isReceive = item.type
        params.license_number = item.license_number
      } else if (type === 'add'&&this.LeftSliderList.length >= 3) {
        this.$vux.toast.show({
          text: '最多只能添加三个车辆',
          type: 'text',
          isShowMask: true,
          position: 'middle',
          width: '14.5em'
        })
        return false
      }

      this.$router.options.routes
        .filter(v => v.name==='CarManage__EditCar')[0]
          .meta.title =
            type === 'add' ? '添加车辆' : '编辑车辆信息'

      this.$router.push({name: 'CarManage__EditCar', params})
    },
    onDelete(id, index) {
      const _ = this, params = { id: id }

      _.$vux.confirm.show({
        content: '是否解绑',
        onCancel () {},
        onConfirm () {
          params.sign = getSign(params)//追加签名验证

          _.$store.commit('updateLoading', true)
          _.$http.post('/index.php/Api/BindLicense/unBundling', params).then((response) => {// 响应成功回调
            _.$store.commit('updateLoading', false)

            if (response.data.code === 0) {
              _.LeftSliderList.splice(index, 1)
              _.$vux.toast.show({
                text: response.data.msg,
                type: 'success',
                isShowMask: true,
                position: 'middle',
                width: '9em'
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
          }, (response) => {
            console.warn('解绑失败:', response)
          })
        }
      })
    },
    toShopRecord({ license_number }) {
      this.$router.push({
        name: 'CarManage__ToShopRecord',
        params: {
          license_number,
          page: 1,
          rows: 1000
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page__list{
  padding: 5px 10px 0;
  .slider {
    height: 82px;
    line-height: 82px;
    text-align: center;
    color: white;
    margin-top: 5px;
    .slider-label {
      width: 100%;
      font-size: 18px;
      background-color: white;
      box-sizing: border-box;
      border: 1px solid #E8E8E8;
      display: flex;
      align-items: center;
      span {
        padding-left: 12px;
      }
      img {
        width: 46px;
        height: 46px;
        margin-left: 18px;
      }
    }
    .slider-button {
      width: 128px;
      color: white;
      display: flex;
      div {
        flex: 1;
        text-align: center;
        &[role="edit"] {
          background-color: #D1D1D1;
        }
        &[role="delete"] {
          background-color: #FF5A60;
        }
      }
    }
  }
  .mask {
    background: transparent;
  }
}
</style>
