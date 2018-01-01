<template>
  <div class="container">
    <div class="user" v-if='authUser'>
      <div class="user-header">
        <div class="text">{{authUser.nickname}}</div>
        <img :src='authUser.headimgurl' alt="">
      </div>
      <div class="user-address">
        <cell title='收货地址'></cell>
        <div class="user-content">{{authUser.address}}</div>
      </div>
      <div class="user-phone">
        <cell title='电话'></cell>
        <div class="user-content">{{authUser.phoneNumber}}</div>
      </div>
      <div class="user-name">
        <cell title='姓名'></cell>
        <div class="user-content">{{authUser.name}}</div>
      </div>
      <!-- <div class="user-order" v-if='user.orders'>
        <cell title='我的订单'></cell>
        <div class="user-order-items" v-for='item in user.orders'>
          <img :src='imageCDN + item.product.images[0] + "?imageView2/1/format/jpg/q/75/imageslim"' alt="">
          <div class="user-order-intro">
            <div class="title">{{item.product.title}}</div>
            <div class="content">{{item.product.intro}}</div>
          </div>
          <div class="user-order-price">
            <span>￥{{item.product.price}}</span>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import cell from '~/components/cell.vue'
import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  head () {
    return {
      title: '个人中心'
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },
  mounted () {
    console.log(this.authUser)
  },

  /* beforeCreate () {
    this.$store.dispatch('fetchUserAndOrders')
  }, */

  components: {
    cell
  }
}
</script>
<style scoped lang='sass' src='~/static/sass/user.sass'></style>