<template>
  <div id="index">
    <div class="page__head">
      <img class="banner" src="../assets/banner.png">
    </div>

    <div class="page__body">
      <Grid class="case">
        <GridItem class="case_item" link="/CarViolation">
          <div class="enter_icon"><img src="../assets/WZDJ_icon.png"></div>
          <div class="enter_text">违章代缴</div>
        </GridItem>
        <GridItem class="case_item" link="/CarLoan">
          <div class="enter_icon"><img src="../assets/QCDK_icon.png"></div>
          <div class="enter_text">汽车贷款</div>
        </GridItem>
        <GridItem class="case_item" link="/CarUsed">
          <div class="enter_icon"><img src="../assets/ESCMM_icon.png"></div>
          <div class="enter_text">二手车买卖</div>
        </GridItem>
        <GridItem class="case_item" @click.native="visit_count">
        <!-- <GridItem class="case_item" @click.native="coming_soon"> -->
          <!-- <div class="enter_icon"><img src="../assets/CPZY_icon_NO.png"></div> -->
          <div class="enter_icon"><img src="../assets/CPZY_icon.png"></div>
          <div class="enter_text">超跑租用</div>
          <!-- <div class="enter_text c_db">超跑租用</div> -->
        </GridItem>
        <GridItem class="case_item" @click.native="coming_soon">
          <div class="enter_icon"><img src="../assets/QCBX_icon.png"></div>
          <div class="enter_text c_db">汽车保险</div>
        </GridItem>
      </Grid>
    </div>

    <div class="page__footer">
      <div v-if="is_collaborate">驾遇汽车平台合作伙伴</div>
      <a :href="'tel:' + tel">联系客服</a>
    </div>
  </div>
</template>

<script>
import { Grid, GridItem } from 'vux'

export default {
  name: 'Home',
  components: { Grid, GridItem },
  data () {
    return {
      tel: '010-59564072' //客服电话
    }
  },
  computed: {
    is_collaborate: () => document.title=="驾遇汽车服务" ? false : true, // 是否显示 合作方
    supercar_hireLink() { // 超跑租用链接
      return 'http://e021511c.u.mgd5.com/campaigns/58ae4ac78e28cd2f3a8b4588/20170728032046/597ae3c2347a1948d6005860/index.html?storeId=' + this.$store.state.shop_id
    }
  },
  created() {
    const _ = this

    _.$store.state.CarLoanData = {//车抵贷的 表单数据置空
      name: '',
			mobile: '',
      city: '',
			city_id: [],
			model_name: '',
			detail_model_id: ''
    }
    _.$store.state.CarUsedData = {//二手车的 表单数据置空
      name: '',
      mobile: '',
      city: '',
      city_id: [],
      card_time: '',
      model_name: '',
      detail_model_id: '',
      mileage: '',
      isQuotes: 0
    }
  },
  methods: {
    coming_soon() {
      this.$vux.toast.show({
       text: '敬请期待',
       type: 'text',
       isShowMask: true,
       position: 'middle',
       width: '10em'
      })
    },
    visit_count() { //超跑访问统计
      this.$http.post('/index.php/Xiaochengxu/Loans/total_click').then(
        response => location.href = this.supercar_hireLink, // 响应成功回调
        response => location.href = this.supercar_hireLink  // 响应错误回调
      )
    }
  }
}
</script>

<style lang="less" scoped>
#index {
  background-color: white;
  .banner {
    width: 100%;
  }
  .case{
    .case_item{
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 12px;
      padding-bottom: 12px;
      font-size: 0.923em;
      flex-direction: column;
      &::before, &::after{
        border-color: transparent;
      }
      .enter_icon{
        img{
          width: 60px;
        }
      }
      .enter_text{
        margin-top: 5px;
      }
      &:nth-of-type(1),
      &:nth-of-type(2),
      &:nth-of-type(3) {
        padding-top: 24px;
      }
      &:nth-of-type(1),
      &:nth-of-type(3) {
        width: 35%!important;
      }
      &:nth-of-type(2) {
        width: 30%!important;
      }
      &:nth-last-of-type(1),
      &:nth-last-of-type(2) {
        width: 26%!important;
      }
      &:nth-last-of-type(1) {
        margin-left: 4%;
        margin-right: 20%;
      }
      &:nth-last-of-type(2) {
        margin-left: 20%;
        margin-right: 4%;
      }
    }
    &::before, &::after{
      border-color: transparent;
    }
  }

  .page__footer{
    position: relative;
    width: 91px;
    margin: 90px auto 30px;
    text-align: center;
    font-size: 12px;
    color: #000;
    height: 27px;
    line-height: 27px;
    background-color: #F5F5F5;
    border: 1px solid #E9EBED;
    border-radius: 5px;
    div{
      position: absolute;
      top: -30px;
      left: 50%;
      margin-left: -100px;
      width: 200px;
    }
  }
  @media (max-width: 320px){
    .page__footer{
      margin-top: 35px;
    }
  }
  @media (min-width: 414px) and (min-height: 736px){
    .page__footer{
      margin-top: 125px;
    }
  }
}
</style>
