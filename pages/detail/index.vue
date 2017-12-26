<template>
  <div class="container">
    <div class="product">
      <div class="slider-img">
        <img src="https://picsum.photos/200/300/?random" alt="">
      </div>
      <div class="content">
        <div class="price" v-if='product.price'>
          <span class="main-price">{{Number(product.price).toFixed(2) - Number(product.price).toFixed(2).substr(-3)}}</span>
          <span class="other-price">{{Number(product.price).toFixed(2).substr(-3)}}</span>
        </div>
      </div>
      <div class="name">{{product.title}}</div>
      <div class="intro">{{product.intro}}</div>
      <div class="info">
        <cell v-for='(item, index) in product.parameters' :key='index' :title='item.key' :content='Number(item.value)'></cell>
      </div>
      <div class="attentions">
        <div class="title">购买提示</div>
        <ol>
          <li v-for='item in attentions'>{{item}}</li>
        </ol>
      </div>
    </div>
    <div class="product-footer">
      <span @click='showInfo = true'>购买</span>
    </div>
    <transition name='slide-top'>
      <div class="payment-modal" v-if='showInfo'>
        <div class="payment-modal-header">
          <span>准备购买</span>
          <span @click='showInfo = false'>取消</span>
        </div>
        <div class="payment-modal-body">
          <div class="info-item">
            <!-- <img :src='imageCDN + product.images[0]' alt=""> -->
            <img src="https://picsum.photos/200/300/?random" alt="">
            <div>
              <p>{{ product.title }}</p>
              <p>价格 ￥{{ product.price }}</p>
            </div>
          </div>
          <div class="info-item">
            <span>收件人</span>
            <input type="text" v-model.trim='info.name' placeholder='你的名字'>
          </div>
          <div class="info-item">
            <span>电话</span>
            <input v-model.trim='info.phoneNumber' type='tel' placeholder='你的电话'>
          </div>
          <div class="info-item">
            <span>地址</span>
            <input v-model.trim='info.address' type='tel' placeholder='收货地址是？'>
          </div>
        </div>
        <div class="payment-modal-footer" @click='handPayment'>确认支付</div>
        </div>
    </transition>
    <transition name='fade'>
      <span class="modal" v-if='modal.visible'>{{ modal.content }}</span>
    </transition>
  </div>
</template>
<script>
import cell from '~/components/cell.vue'
import { mapState } from 'vuex'

export default {
  head () {
    return {
      title: '购买页面'
    }
  },

  data () {
    return {

      attentions: [
        '商品和服务的差异',
        '清关服务',
        '物流服务',
        '需要更多帮助，请联系管理员'
      ],

      showInfo: false,

      info: {
        name: '',
        phoneNumber: '',
        address: ''
      },

      modal: {
        visible: false,
        content: '成功',
        timer: null
      }
    }
  },

  computed: {
    ...mapState({
      'imageCDN': 'imageCDN',
      'product': 'currentProduct'
    })
  },

  methods: {
    async handPayment () {
      console.log('支付逻辑')
    },
  },

  async beforeMount () {
    const id = this.$route.query.id
    // console.log(id)
    const url = window.location.href
    await this.$store.dispatch('showProduct', id)
  },

  components: {
    cell
  }
}
</script>
<style scoped lang='sass' src='~/static/sass/deal.sass'></style>