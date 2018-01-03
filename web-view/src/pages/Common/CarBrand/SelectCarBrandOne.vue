<template>
  <div>
    <XHeader v-if="$store.state.isAndroid">{{$route.meta.title}}</XHeader>
    <scroller
      ref="scrollerOne"
      class="scrollerOne"
      :height="$store.state.isAndroid?'-46':''"
      lock-x scrollbar-y enable-horizontal-swiping
      @on-scroll="scrollerOneEvent">
      <div class="page__list">
        <group
          class="carbrand_title"
          v-for="(items, index) in brand_list_1"
          :key="index"
          :title="index"
          :id="index"
        >
          <cell
            v-for="item in items"
            :key="item.brand_id"
            :title="item.brand_name"
            :is-link="true"
            @click.native="getBrandListTwo(item.brand_id)"
          >
            <img slot="icon" :src="item.brand_logo">
          </cell>
        </group>
      </div>
    </scroller>

    <transition
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOutRight"
    >
      <scroller ref="scrollerTwo" class="scrollerTwo" :style="{top: $store.state.isAndroid?'46px':'0px'}" :height="$store.state.isAndroid?'-46':''" lock-x scrollbar-y enable-horizontal-swiping v-show="isShowTwo">
        <div class="page__list">
          <group gutter="0">
            <cell
              v-for="item in brand_list_2"
              :key="item.model_id"
              :title="item.model_name"
              :is-link="true"
              @click.native="next_page(item.model_id, item.model_name)"
            >
            </cell>
          </group>
        </div>
      </scroller>
    </transition>

    <ul
      v-if="searchLetter.length>0"
      :style="{marginTop: searchLetterMarginTop+'px', zIndex: searchLetterZIndex}"
      @touchmove="search_move($event)"
      @touchend="search_end"
      class="searchLetter">
      <li v-for="(item, index) in searchLetter" :key="index" @click="search_move($event, item)">{{ item }}</li>
    </ul>

    <div v-show="isShowLetter" class="showSlectedLetter">
      {{showLetter}}
    </div>
  </div>
</template>

<script>
import { XHeader, Scroller, Group, Cell } from 'vux'

export default {
  name: 'CarBrandOne',
  components: {
    XHeader, Scroller, Group, Cell
  },
  data () {
    return {
      status: {
        pullupStatus: 'default'
      },
      brand_list_1: {},//车系一级信息
      brand_list_2: [],//车系二级信息
      isShowLetter: false,
      isShowTwo: false,
      showLetter: '',
      searchLetterMarginTop: '0',
      searchLetterZIndex: '',
      searchLetter: [],
      scrollerTop: {}
    }
  },
  mounted() {
    const _ = this

    _.$store.commit('updateLoading', true)
    _.$http.post('/index.php/Xiaochengxu/SecondHand/getCarModelsList1').then((response) => {// 响应成功回调
      _.$store.commit('updateLoading', false)

      if (response.data.code === 0) {
        let data = {}, temp = response.data.data[0]['car']
        let keys = Object.keys(temp).sort()

        keys.forEach(v => data[v] = temp[v])

        _.brand_list_1 = data//更新列表
        _.searchLetter = keys
        _.searchLetterMarginTop = -(keys.length/2*16)

        _.$nextTick(() => {
          _.$refs.scrollerOne.reset()
        })
      } else {
        console.warn('拉取车系一级信息失败', response)
      }
    }, (response) => {// 响应错误回调
      _.$store.commit('updateLoading', false)
      console.warn('拉取车系一级信息失败', response)
    })
  },
  methods: {
    next_page(model_id, name) {
      const _ = this

      _.$router.push({
        name: 'CarBrandTwo',
        params: {
          model_id: model_id,
          name: name,
          ParentPage: _.$route.params.ParentPage
        }
      })
    },
    search_move(e, k) {
      const _ = this

      let itemH = e.target.offsetHeight//单个item的高
      let dY = e.pageY||e.touches[0].pageY + _.searchLetterMarginTop
      let index = Math.ceil(dY / itemH), l = _.searchLetter.length
          index = (dY > itemH*l) ? l-1 : (dY < 0) ? 0 : index
      let item = k ? k : _.searchLetter[index]

      _.showLetter = item
      _.isShowLetter = true
      _.$nextTick(() => {
        _.$refs.scrollerOne.reset({top: _.scrollerTop[item]})
      })
    },
    search_end() {
      const _ = this
      setTimeout(() => {_.isShowLetter = false, _.showLetter = ''}, 800)
    },
    getBrandListTwo(brand_id) {
      const _ = this

      _.$store.commit('updateLoading', true)
      _.$http.get('/index.php/Xiaochengxu/SecondHand/getSunModelsList'
      ,{
        params: {brand_id: brand_id},
        timeout: 5000
      }).then((response) => {// 响应成功回调
        _.$store.commit('updateLoading', false)

        if (response.data.code === 0) {
          _.brand_list_2 = response.data.data//更新列表

          _.isShowTwo = true
          _.$nextTick(() => {
            _.$refs.scrollerTwo.reset()
          })
        } else {
          console.warn('拉取车系二级信息失败', response)
        }
      }, (response) => {// 响应错误回调
        console.warn('拉取车系二级信息失败', response)

        _.$store.commit('updateLoading', false)
        _.$vux.toast.show({
          text: '请求超时',
          type: 'cancel',
          isShowMask: true,
          position: 'middle',
          width: '9em'
        })
      })
    },
    scrollerOneEvent(top, left) {
      this.isShowTwo = false
    }
  },
  watch: {
    isShowTwo(r) {
      this.searchLetterZIndex = r ? -1 : ''
    },
    searchLetter() {
      const _ = this
      const header_height = this.$store.state.isAndroid ? document.querySelector('.vux-header').clientHeight : 0

      setTimeout(() => {
        _.searchLetter.forEach(v => {//获取每个 字母分组块的 scrollTop
          let top = document.querySelector('#'+v).getBoundingClientRect().top - header_height
          let maxTop = document.querySelector('.xs-container').offsetHeight - window.innerHeight
          _.scrollerTop[v] = top > maxTop ? maxTop : top
        })
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.weui-cell {
  padding-top: 6px!important;
  padding-bottom: 6px!important;
}
.scrollerOne, .scrollerTwo {
  z-index: 0;
}
.scrollerTwo {
  position: absolute;
  right: 0;
  width: 55%;
  box-shadow: -5px 0px 8px #eeeeee;
  background-color: white;
  .weui-cell {
    padding-top: 14px!important;
    padding-bottom: 14px!important;
  }
}
img {
  width: 35px;
  height: 35px;
  margin-right: 9px;
}
.searchLetter {
    position: fixed;
    top: 50%;
    right: 0;
    width: 16px;
    line-height: 16px;
    border-radius: 3px;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    z-index: 1;
    li {
      list-style: none;
      color: black;
      font-size: 11px;
    }
}
.showSlectedLetter {
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 47%;
    left: 50%;
    margin: -50px;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    font-size: 26px;
    z-index: 1;
}
</style>
