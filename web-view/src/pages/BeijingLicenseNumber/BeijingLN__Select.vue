<template>
  <div>
    <div class="page__head">
      <img src="../../assets/beijing-LN/jpgh-banner@2x.png">
    </div>
    <Card class="card">
      <ul slot="header" class="header" @click="jumpHandler(current_number)">
        <li>
          <div class="title">
            <span>车牌选择</span>
            <span @click.stop="dialogTigger = true">
              <img src="../../assets/xzcp-cjwt-icon@2x.png">
            </span>
          </div>
          <div class="selected">
            <span>当前选中：</span>
            <NumberItem :text="current_number.number" disabled v-model="current_number.number"></NumberItem>
          </div>
        </li>
        <li v-show="!isEmptyObject(current_number)"><x-icon class="icon-arrow" type="ios-arrow-forward" size="27"></x-icon></li>
      </ul>
      <Scroller slot="content" ref="myScroller" height="-239" lock-x scrollbar-y v-if="all_number.length > 0">
        <flexbox
          class="content"
          :gutter="0"
          wrap="wrap">
          <flexbox-item
            class="content-item"
            v-for="(item, index) of all_number"
            :key="index"
            :span="3.535"
            @click.native="current_number = item">
            <NumberItem :text="item.number" :disabled="item.isChecked" v-model="item.isChecked" @click.native="selectedHandler(item)"></NumberItem>
          </flexbox-item>
        </flexbox>
      </Scroller>
      <NoList slot="content" :list="all_number" text="暂无信息" type="2" top="30%" width="33%"></NoList>
    </Card>

    <XDialog class="dialog" hide-on-blur :show.sync="dialogTigger"
      :dialog-style="{
        width: '88%',
        maxWidth: '400px',
        padding: '15px 20px',
        boxSizing: 'border-box',
        borderRadius: '10px'
      }">
      <div class="close" @click="dialogTigger = false">
        <img src="../../assets/beijing-LN/jpgh-cjwt-gb-icon@2x.png">
      </div>
      <h3 class="title">常见问题</h3>
      <div class="content">
        问：车牌怎么过户？
        <br>答：您通过出资购买车牌后我们会把公司使用权及车牌全部过户给您。
        <br>问：公司有没有债务及纠纷？
        <br>答：我们过户给您的公司都是无债务，无纠纷，无官司的，并且我们会给您提供相关证书、保证公司是合规合法、手续齐全。
        <br>问：我可以使用多久，能否在次过户？
        <br>答：过户给您的车牌你可以永久使用，如果您有不继续使用的情况我们负责收回。
      </div>
    </XDialog>
  </div>
</template>

<script>
import { Card, Scroller, Flexbox, FlexboxItem, XButton, XDialog } from 'vux'
import { Shade, NoList } from '@/components'
import NumberItem from './components/Numberitem'

export default {
  name: 'BeijingLN__Select',
  components: {
    Card, Scroller, Flexbox, FlexboxItem, XButton, XDialog,
    NoList,
    NumberItem
  },
  data() {
    return {
      dialogTigger: false,    // 常见问题 Dialog的触发器
      all_number_title: '',   // 展开的全部车牌中的title
      all_number: [],         // 展开的全部车牌
      current_number: {},     // 当前选中的车牌
    }
  },
  watch: {
    all_number() {
      this.$nextTick(() => this.$refs.myScroller.reset())
    }
  },
  created () {
    this.$http.post('/index.php/Xiaochengxu/CaiYun/getLicenseNumber')
      .then(res => {
        res = res.data
        if (res.code == 0) {
          res = res.data
          // let temp = [...res.common, ...res.common, ...res.common, ...res.common]
          // let amf = (s) => JSON.parse(JSON.stringify(s))
          // this.all_number = [...amf(temp), ...amf(temp), ...amf(temp), ...amf(temp), ...amf(temp), ...amf(temp), ...amf(temp)]
          this.all_number = res.common.map(v => (v.number = v.number.replace(/\s+/, ''), v))
          console.warn(this.all_number)
        } else
          this.toastFail(res.msg)
      })
      .catch(err => console.error(''))
  },
  methods: {
    selectedHandler(item) {
      this.all_number.forEach(v => {
        if (v !== item)
          v.isChecked = false
      })
    },
    jumpHandler(params) {
      if ( this.isEmptyObject(params) )
        return false

      this.$router.push({ name: 'BeijingLN__AddInfo', params })
    }
  }
}
</script>

<style lang="less" scoped>
.page__head {
  height: 151px;
  img {
    width: 100%;
  }
}
.card:after,
.no_order:after {
  border: none;
}
.card {
  margin: 0;
  background-color: transparent;
  .header {
    line-height: 14px;
    font-size: 14px;
    background-color: white;
    padding-left: 25px;
    padding-right: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    li {
      & > div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .title {
        span:last-child {
          padding: 10px;
        }
        img {
          width: 15px;
          height: 15px;
          margin-left: -2px;
        }
      }
      .selected {
        padding-bottom: 10px;
        padding-left: 33px;
        .number {
          width: 121px;
          min-height: 41px;
          line-height: 41px;
          font-size: 20px;
          background-color: transparent;
        }
      }
      &:first-child {
        flex-grow: 1;
      }
      &:last-child {
        line-height: 0;
      }
    }
  }
  .content {
    box-sizing: border-box;
    align-items: flex-start;
    padding: 15px 30px;
    .content-item {
      &:not(:nth-child(3n)) {
        margin-right: 15px;
      }
      margin-top: 5px!important;
      margin-bottom: 5px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      font-size: 16px;
    }
  }
}

.dialog {
  @size: 20px;
  position: relative;
  .close {
    position: absolute;
    width: @size;
    height: @size;
    right: 0;
    top: -5px;
    padding: @size;
    img {
      width: @size;
      height: @size;
    }
  }
  .title {
    font-size: 17px;
    line-height: 17px;
    font-weight: normal;
    margin-bottom: 10px;
  }
  .content {
    text-align: justify;
  }
}
</style>