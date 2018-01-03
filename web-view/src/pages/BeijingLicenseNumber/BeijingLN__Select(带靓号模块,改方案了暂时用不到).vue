<template>
  <div>
    <div class="page__head">
      <img src="../../assets/beijing-LN/jpgh-banner@2x.png">
    </div>
<!--展开的全部号码  -->
    <popup v-model="isShowAll" position="bottom" width="100%" height="100%">
      <router-view></router-view>
    </popup>
<!--普通号  -->
    <Card class="card">
      <div slot="header" class="header">
        <span>{{ number_1_title }}</span>
        <router-link
          class="all-button"
          v-if="Licen_1.length > 0"
          tag="span"
          @click.native="isShowAll = true"
          :to="{
            name: 'BeijingLN__SelectAll',
            params: { title: number_1_title, numbers: number_1 }
          }">
          <img src="../../assets/beijing-LN/jpgh-qb-icon@2x.png">全部
        </router-link>
      </div>
      <div slot="content" class="content">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item
            class="content-item"
            v-for="(item, index) of Licen_1"
            :key="index"
            :span="3.535">
            <router-link :to="{ name: 'BeijingLN__AddInfo', params: item }">
              <NumberItem :text="item.number"></NumberItem>
            </router-link>
          </flexbox-item>
        </flexbox>
        <NoList :list="Licen_2" text="暂无信息" type="2" top="4%" width="33%"></NoList>
      </div>
    </Card>
<!--靓号区  -->
    <Card class="card">
      <div slot="header" class="header">
        <span>{{ number_2_title }}</span>
        <router-link
          class="all-button"
          v-if="Licen_2.length > 0"
          tag="span"
          @click.native="isShowAll = true"
          :to="{
            name: 'BeijingLN__SelectAll',
            params: { title: number_2_title, numbers: number_2 }
          }">
          <img src="../../assets/beijing-LN/jpgh-qb-icon@2x.png">全部
        </router-link>
      </div>
      <div slot="content" class="content">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item
            class="content-item"
            v-for="(item, index) of Licen_2"
            :key="index"
            :span="3.535">
            <router-link :to="{ name: 'BeijingLN__AddInfo', params: item }">
              <NumberItem :text="item.number"></NumberItem>
            </router-link>
          </flexbox-item>
        </flexbox>
        <NoList :list="Licen_2" text="暂无信息" type="2" top="4%" width="33%"></NoList>
      </div>
    </Card>
    <div class="footer">
      <x-button text="常见问题" mini plain @click.native="dialogTigger = true"></x-button>
    </div>

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
import { Popup, Card, Scroller, Flexbox, FlexboxItem, XButton, XDialog } from 'vux'
import { Shade, NoList } from '@/components'
import NumberItem from './components/Numberitem'

export default {
  name: 'BeijingLN__Select',
  components: {
    Popup, Card, Scroller, Flexbox, FlexboxItem, XButton, XDialog,
    Shade, NoList,
    NumberItem
  },
  data() {
    return {
      dialogTigger: false,    // 常见问题 Dialog的触发器
      isShowAll: false,       // 是否显示所有车牌
      // all_number_title: '',   // 展开的全部车牌中的title
      // all_number: [],         // 展开的全部车牌
      // current_number: {},     // 当前选中的车牌
      number_1_title: '普通区（10万—15万）',
      number_1: [],
      number_2_title: '普通区（15万—20万）',
      number_2: []
    }
  },
  computed: {
    isUnfold() {
      return this.all_number.length > 0
    },
    Licen_1() {
      return this.number_1.slice(0, 9)
    },
    Licen_2() {
      return this.number_2.slice(0, 9)
    }
  },
  created () {
    this.$http.post('/index.php/Xiaochengxu/CaiYun/getLicenseNumber')
      .then(res => {
        res = res.data
        if (res.code == 0) {
          res = res.data
          console.warn(res)
          // this.number_1 = [...res.common, ...res.common, ...res.common, ...res.common, ...res.common, ...res.common, ...res.common]
          this.number_1 = res.common // 普通号
          this.number_2 = res.hot    // 靓号
        } else
          this.toastFail(res.msg)
      })
      .catch(err => console.error(''))
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
.card {
  margin: 0;
  background-color: transparent;
  &.card-unfold {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #F5F5F5;
    .header {
      padding-left: 25px;
      padding-right: 7px;
      display: flex;
      align-items: center;
      li {
        .current-select {
          padding-bottom: 10px;
          padding-left: 33px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
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
      height: 100%;
    }
  }
  &:not(.card-unfold) .header:before {
    content: "";
    width: 5px;
    height: 100%;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    background: #fb0;
  }
  .header {
    line-height: 35px;
    padding: 0 12px;
    font-size: 14px;
    position: relative;
    background-color: white;
    display: flex;
    justify-content: space-between;
    .all-button {
      display: flex;
      align-items: center;
      img {
        margin-right: 6px;
        width: 12px;
        height: 11px;
      }
    }
  }
  .content {
    box-sizing: border-box;
    height: 160px;
    overflow: hidden;
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
.footer {
  text-align: center;
  margin-top: 9px;
  button {
    padding: 1px 14px;
    border-radius: 16px!important;
    border: none;
    background-color: #DBDBDB;
    color: white;
  }
}

.dialog {
  position: relative;
  .close {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 0;
    top: -5px;
    padding: 20px;
    img {
      width: 100%;
      height: 100%;
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