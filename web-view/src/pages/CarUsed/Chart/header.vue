<template lang="html">
  <div class="title">
    <h1>{{name}}</h1>
    <div class="legend-wrapper">
      <ul>
        <li
          v-for="(legend,index) in legendArr"
          @mouseout="donwplay(index)"
          @mouseover="highlight(index)"
        >
          <i :style="styleArr[index]"></i>{{legend.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    legendArr: {
      type: Array,
      default: []
    },
    myChart: Object,
    name: String
  },
  created() {
    this.__init()
  },
  data() {
    return {
      styleArr: [],
      color: this.$parent.color
    }
  },
  methods: {
    __init() {
      this.color.forEach((color) => {
        this.styleArr.push({
          background: color
        })
      })
    },
    highlight(index) {
      this.myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: index
      });
    },
    donwplay(index) {
      this.myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: index
      })
    }
  }
}

</script>

<style lang="less" scoped>
.title{
  position: relative;
  display: flex;
  height: 30px;
  line-height: 30px;
  width: 100%;
  h1{
    font-size: 14px;
    font-weight: normal;
    padding-left: 15px;
  }
  ul{
    position: absolute;
    right: 0;
    padding-right: 5px;
    li{
      display: inline-block;
      min-width: 59px;
      padding: 2px 10px 2px 10px;
      line-height: 20px;
      text-align: center;
      font-size: 11px;
      i{
        display: inline-block;
        margin-right: 5px;
        width: 8px;
        height: 8px;
      }
    }
  }
}
</style>
