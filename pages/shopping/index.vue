<template>
  <div class="container">
    <div class="shopping">
      <div class="title">权游周边</div>
      <div class="list">
        <div class="items" v-for='(item, index) in products' :key='index' @click='showProduct(item)'>
          <!-- <img :src='imageCDN + item.images[0]' alt=""> -->
          <img src="https://picsum.photos/200/300/?random" alt="">
          <div class="body">
            <div class="title">{{item.title}}</div>
            <div class="content">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: '手办商城'
    }
  },

  computed: {
    ...mapState([
      'products',
      'imageCDN'
    ])
  },

  methods: {
    showProduct(item) {
      this.$router.push({
        path: '/detail',
        query: {
          id: item._id
        }
      })
    }
  },

  async mounted() {
    await this.$store.dispatch('fetchProducts')
  }
}
</script>
<style scoped lang='sass' src='~/static/sass/shopping.sass'></style>