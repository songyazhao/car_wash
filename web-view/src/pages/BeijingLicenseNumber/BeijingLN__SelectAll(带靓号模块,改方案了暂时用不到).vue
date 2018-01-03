<template>
  <Card class="card card-unfold">
    <ul slot="header" class="header" @click="jumpHandler(current_number)">
      <li>
        <div>{{ title }}</div>
        <div class="current-select">
          <span>当前选中：</span>
          <NumberItem :text="current_number.number" disabled v-model="current_number.number"></NumberItem>
        </div>
      </li>
      <li><x-icon class="icon-arrow" type="ios-arrow-forward" size="27"></x-icon></li>
    </ul>
    <Scroller slot="content" ref="myScroller" height="-88" lock-x zscrollbar-y>
      <flexbox
        class="content"
        :gutter="0"
        wrap="wrap">
        <flexbox-item
          class="content-item"
          v-for="(item, index) of numbers"
          :key="index"
          :span="3.535"
          @click.native="current_number = item">
          <NumberItem :text="item.number" :disabled="item.isChecked" v-model="item.isChecked" @click.native="selectedHandler(item)"></NumberItem>
        </flexbox-item>
      </flexbox>
    </Scroller>
  </Card>
</template>

<script>
import { Card, Scroller, Flexbox, FlexboxItem } from 'vux'
import NumberItem from './components/Numberitem'

export default {
  name: 'BeijingLN__SelectAll',
  components: {
    Card, Scroller, Flexbox, FlexboxItem,
    NumberItem
  },
  data () {
    let params = this.$route.params
    let numbers = params.numbers.map(v => (v.isChecked = false, v))
    return {
      title: params.title || '',         // 展开的全部车牌中的title
      numbers,                           // 展开的全部车牌
      current_number: {},                // 当前选中的车牌
    }
  },
  methods: {
    selectedHandler(item) {
      this.numbers.forEach(v => {
        if (v !== item)
          v.isChecked = false
      })
    },
    jumpHandler(params) {
      if ( this.isEmptyObject(params) )
        return this.toastFail('请选择一个车牌')

      this.$router.push({ name: 'BeijingLN__AddInfo', params })
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
