<template>
  <div class="container">
    <div class="character-header">
      <img v-if="character.images" :src="imageCDN + character.images[character.images.length - 1]" class="background">
      <div class="media">
        <img v-if="character.profile" :src="imageCDN + character.profile + '?imageView2/1/w/280/h/440/format/jpg/q/75'">
        <div class="desc">
          <div class="names">
            <p class="cname">{{ character.cname }}</p>
            <p class="name">{{ character.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="character-body">
      <div class="intro">
        <p v-for="(item, index) in character.intro" :key="index">{{item}}</p>
      </div>
      <div class="stills">
        <img v-for="(item, index) in character.images" :src="imageCDN + item + '?imageView2/1/w/750/h/460/format/jpg/q/80'" :key="index" alt="">
      </div>
      <div class="items" v-for="(item, index) in character.sections" :key="index">
        <div class="title">{{ item.title }}</div>
        <div class="body" v-for="(text,index) in item.content" :key="index">{{text}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head () {
    return {
      title: '家族成员详情'
    }
  },

  computed: {
    ...mapState({
      imageCDN: 'imageCDN',
      character: 'currentCharacter'
    })
  },

  beforeCreate () {
    let id = this.$route.query.id

    this.$store.dispatch('showCharacter', id)
  }
}
</script>

<style scoped lang='sass' src='~/static/sass/character.sass'></style>
