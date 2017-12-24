<template>
  <div class="container">
    <div class="house-media">
      <img v-if='house.cname' :src='imageCDN + house.cname + ".png"' alt="">
      <div class="desc">
        <div class="words">{{house.words}}</div>
        <div class="name">{{house.name}}</div>
      </div>
    </div>
    <div class="house-body">
      <div class="title">{{house.cname}}</div>
      <div class="body">{{house.intro}}</div>
      <div class="title">主要角色</div>
      <div class="body" v-for='(item, index) in house.swornMembers' :key='index'>
        <div class="members" v-if='item.character'>
          <img :src='imageCDN + item.character.profile + "?imageView2/1/w/280/h/440/format/jpg/q/75"' @click='showCharacter(item)' alt="">
          <div class="desc">
            <div class="cname">{{item.character.cname}}</div>
            <div class="intro">{{item.text}}</div>
          </div>
        </div>
        <div class="house-history" v-for='(item, index) in house.sections' :key='index'>
          <div class="title">{{item.title}}</div>
          <div class="content" v-for='(text, index) in item.content' :key="index">{{text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  head () {
    return {
      title: '家族详情'
    }
  },

  computed: {
    ...mapState({
      house: 'currentHouse',
      imageCDN: 'imageCDN'
    })
  },

  beforeCreate () {
    let id = this.$route.query.id

    this.$store.dispatch('showHouse', id)
  },

  methods: {
    showCharacter (item) {
      this.$router.push({
        path: '/character',
        query: {
          id: item._id
        }
      })
    }
  }
}
</script>
<style scoped lang='sass' src='~/static/sass/house.sass'></style>