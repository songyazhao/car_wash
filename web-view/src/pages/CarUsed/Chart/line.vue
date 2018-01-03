<!-- 折线图 -->
<style lang="less">
canvas{
  margin-top: -60px!important;
}
</style>
<style lang="less" scoped>
.line{
  .outer{
    height: 150px;
    .main{
      height: 240px;
      width: 120.5%;
      margin-left: -10.25%;
    }
  }
}
</style>

<template>
  <div class="line">
    <v-header :name="name" :legendArr="legendArr" :myChart="myChart"></v-header>
    <div class="outer">
      <div class="main"></div>
    </div>
  </div>
</template>

<script>
import header from './header'

let echarts = require('echarts/lib/echarts')// 引入 ECharts 主模块
              require('echarts/lib/chart/line')// 引入折线图
              require('echarts/lib/component/tooltip')// 引入提示框组件

export default {
  name: 'Chart-line',
  components: {
    'v-header': header
  },
  props: {
    trendData: [Object, Array]
  },
  data() {
    return {
      charts: [],
      legendArr: [],
      color: ['#46B7C5', '#FFBB00'], //折线图颜色配置
      myChart: {},
      name: '价格走势',
      xAxis_data: [], //x轴坐标
      yAxis_data: [], //y轴坐标
    }
  },
  computed: {
    is_show_chart() {
      return this.$store.state.CarUsedData.isQuotes
    }
  },
  mounted() {
    const _ = this

    new Promise((resolve, reject) => {
      resolve()
    }).then(() => {
      if (_.is_show_chart) _.__init()
    })
  },
  methods: {
    __init() {
      const _ = this

      _._mount()
      _.legendArr = _.myChart.getOption().series
      _.legendArr.forEach((data) => {
        data.selected = true
      })
      _.charts.push(_.myChart)
      window.addEventListener('resize', function() {
        _.myChart.resize()
      }.bind(_))
    },
    _getData() {
      const _ = this, temp = _.trendData['vehicle_price']

      _.xAxis_data = temp.map(//X轴的点
        (v, i) => {
          return i===0||i===temp.length-1
            ? '' : (v.month >= 10 ? v.month : v.month[1]) + '月'
        }
      )

      for (let k in _.trendData) {

        if (_.trendData.hasOwnProperty(k)) {
          let data = _.trendData[k].map(v => v.price)//Y轴的点
              data.push(Math.max.apply(Math, data) * 1.5)//Y轴最大值

          data.forEach((v, i) => {
            data[i] = {
              value: data[i],
              symbol: i==0||i==data.length-2 ? 'none'
                        : i==1 ? 'emptyCircle' : 'circle',
              symbolSize: 7,
              label: {//折线转折点样式
                normal: {
                  show: true,
                  formatter: o => o.value + '万',
                  position:  k==='vehicle_price' ? 'top' : 'bottom',
                  textStyle: {
                    color: '#333',
                    fontSize: 7,
                  }
                }
              },
              tooltip: {
                position: 'inside'
              }
            }
          })

          _.yAxis_data.push({
            name: k==='vehicle_price' ? '零售价格' : '收购价格',
            type: 'line',
            showAllSymbol: true,
            data: data
          })
        }
      }
    },
    _mount() {
      const _ = this

      if (!_.is_show_chart) return
      _._getData()
      // 基于准备好的dom，初始化echarts实例
      _.myChart = echarts.init(document.querySelector('.line .main'))
      _.myChart.setOption({
        title: {
          show: false
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false
        },
        toolbox: {
          show: false
        },
        color: _.color,
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.69)'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E5E5E5'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#F0F0F0', '#F0F0F0']
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              color: 'black'
            }
          },
          boundaryGap: false,
          data: _.xAxis_data
        }],
        yAxis: [{
          axisLine: {
            show: false
          },
          nameLocation: 'end',
          nameGap: 20,
          nameRotate: 0,
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['transparent']
            }
          },
          axisLabel: {
            show: false
          }
        }],
        series: _.yAxis_data
      })
    }
  }
}

</script>
