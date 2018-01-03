<template>
  <div id="about_us">
    <div class="page__head">
      <img class="banner" src="../assets/aboutus_banner.jpg">
    </div>

    <div class="page__body">
      <section>
        <div class="title">
          <h4>公司简介</h4>
          <h6>About Us</h6>
        </div>
        <p>
          北京驾遇互联科技有限公司成立于2014年8月，是国内首家B2B2C的车后市场一站式增值服务平台，为传统汽车服务行业提供多元化经营产品，突破原有单一的获利模式，帮助商家深度挖掘客户潜在价值，驾遇上线以来已成为中国最具实力与创新力的车后服务辅营平台。
        </p>
      </section>
      <section>
        <div class="title">
          <h4>业务体系</h4>
          <h6>Products&Services</h6>
        </div>
        <p>
          车险在线办理、二手车估值、车辆抵押贷款、违章信息在线处理、车务代办等”。
        </p>
        <p>
          驾遇上线以来获得广大商家和车主的好评。目前已拥有北京、深圳、厦门、福州、成都、武汉、长沙、太原八座城市的运营团队，数千家合作商户，辐射了千万级的车主。
        </p>
      </section>
      <section>
        <div class="title">
          <h4>联系我们</h4>
          <h6>Contact Us</h6>
        </div>
        <p><span>电话号码：</span><span><a href="tel:01059564072">010-59564072</a></span></p>
        <p>
          <span>联系地址：</span>
          <span>北京市海淀区安宁庄西路9号院25号楼iMOMA大厦优投空间U105</span>
        </p>
        <p><span>邮箱地址：</span><span><a href="mailto:fengsha@caryu.net">fengsha@caryu.net</a></span></p>
        <p><span>公众号：</span><span>驾遇汽车平台</span></p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
#about_us{
  background-color: white;
  color: #5C5C5C;
  padding-bottom: 60px;
  .page__body{
    margin-bottom: 6px;
    section{
      word-break: break-all;
      border: 1px solid #E9EBED;
      margin: 28px 7px 0;
      padding: 36px 12px 10px;
      position: relative;
      .title{
        width: 96px;
        position: absolute;
        top: -12px;
        left: 50%;
        margin-left: -48px;
        background-color: white;
        h4, h6{
          text-align: center;
        }
        h4{
          font-size: 14px;
          color: black;
        }
        h6{
          color: #CDCDCD;
          font-weight: normal;
        }
      }
      p{
        overflow: hidden;
        span:first-child{
          float: left;
          width: 21.5%;
        }
        span:nth-child(2){
          float: left;
          width: 77%;
          a{color: #5C5C5C;}
        }
      }
      &:not(:nth-child(3)) p{
        text-align: justify;
      }
      &:nth-child(2) p:not(:nth-of-type(1)){
        margin-top: 15px;
      }
    }
  }
}
</style>
