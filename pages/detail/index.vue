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
import wechat from '~/static/mixins/wechat.js'

function toggleModal (obj, content) {
  clearTimeout(obj.timer)
  obj.visible = true
  obj.content = content
  obj.timer = setTimeout(() => {
    obj.visible = false
  }, 1500)
}

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
      const that = this
      const {
        name,
        address,
        phoneNumber
      } = this.info

      if (!name || !address || !phoneNumber) {
        toggleModal(this.modal, '收货信息忘填了哦~')

        return
      }

      const {data} = await this.$store.dispatch('createOrder', {
        productId: this.product._id,
        name: name,
        address: address,
        phoneNumber: phoneNumber
      })

      if (!data || !data.success) {
        toggleModal(this.modal, '服务器异常，请等待后重新尝试')

        return
      }

      // 调用微信支付的sdk
      window.wx.chooseWXPay({
        timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
        package: data.package, // 统一支付接口返回的 prepay_id 参数值，提交格式如：prepay_id=***）
        signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.paySign, // 支付签名
        success: (response) => {
          try {
            window.WeixinJSBridge.log(response.err_msg)
          } catch (e) {
            console.error(e)
          }

          if (response.err_msg === 'get_brand_wcpay_request:ok') {
            // 支付成功
            toggleModal(that.modal, '支付成功')
          }
        }
      })
    }
  },

  // 注入js sdk
  mixins: [wechat],

  async beforeMount () {
    const id = this.$route.query.id
    // console.log(id)
    const url = window.location.href
    // 获取商品详情
    await this.$store.dispatch('showProduct', id)
    // 初始化js sdk的环境
    await this.wechatInit(url)
  },

  components: {
    cell
  }
}
</script>
<style scoped lang='sass' src='~/static/sass/deal.sass'></style>
