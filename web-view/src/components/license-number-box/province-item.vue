<template>
  <section>
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div class="mask" v-show="$parent.$refs.LicenNumberInput.is_province_items_show" @click="$parent.$refs.LicenNumberInput.province_items_toggle(false)"></div>
    </transition>

    <transition
      enter-active-class="animated bounceInUp"
      leave-active-class="animated bounceOutDown"
    >
      <Grid class="province_items" v-show="$parent.$refs.LicenNumberInput.is_province_items_show">
        <GridItem
          class="item"
          v-for="(item, index) in $parent.$refs.LicenNumberInput.province_items"
          :key="index"
          :label="item"
          @click.native="$parent.$refs.LicenNumberInput.select_province(item)">
        </GridItem>
      </Grid>
    </transition>
  </section>
</template>

<script>
import { Grid, GridItem } from 'vux'

export default {
  name: 'ProvinceItem',
  components: {
    Grid, GridItem
  }
}
</script>

<style lang="less" scoped>
.province_items {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #F0F0F0;
  color: #2D38A1;
  z-index: 99;
  padding: 1% 0;
  &::before, &::after{
    border: none;
  }
  .item{
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 2px #999;
    margin: 1.35% 1.055%;
    padding: 12px 0px;
    width: 9%!important;
    &::before, &::after{
      border: none;
    }
  }
}
</style>