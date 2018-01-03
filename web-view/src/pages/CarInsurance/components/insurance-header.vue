<template>
  <Card class="card">
    <div slot="header" class="header">
      <h3 class="c_59">{{ license_number }}</h3>
      <div class="c_a1">{{ carType }}</div>
    </div>
    <div slot="content" class="content c_59">
      <div>投保公司：{{ insuranceCompany }}</div>
      <template v-if="applicantAndInsured && applicantAndInsured.applicant != ''">
        <div v-if="applicantAndInsured.insured_eq_applicant == 1">投保人/受益人：{{ applicantAndInsured.applicant }}</div>
        <template v-else>
          <div>投保人：{{ applicantAndInsured.applicant }}</div>
          <div>受益人：{{ applicantAndInsured.insured }}</div>
        </template>
      </template>
    </div>
  </Card>
</template>

<script>
import { Card } from 'vux'

export default {
  name: 'insurance-header',
  components: { Card },
  props: {
    licenseNumber: {
      type: String,
      require: true
    },
    carType: {
      type: String,
      require: true
    },
    insuranceCompany: {
      type: String,
      require: true
    },
    applicantAndInsured: {
      type: [Object, Boolean],
      require: true
    }
  },
  computed: {
    license_number() {
      let sn = this.licenseNumber
      return sn ? ( sn.substr(0, 1) + '·' + sn.substr(1, sn.length - 1) ) : ''
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  padding-left: 22px;
  border-left: 1px solid #F0F0F0;
  border-right: 1px solid #F0F0F0;
  .header {
    border-bottom: 1px solid #E5E5E5;
    padding-top: 12px;
    padding-bottom: 9px;
    h3 {
      font-weight: normal;
    }
  }
  .content {
    padding-top: 9px;
    padding-bottom: 14px;
    div:last-child {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
