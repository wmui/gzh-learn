<template>
  <div id="app">
    <v-header />
    <div id="container">
      <v-aside />
      <nuxt/>
    </div>
  </div>
</template>

<script>
import vHeader from '~/components/header.vue'
import vAside from '~/components/aside.vue'

export default {
  components: {
    vHeader,
    vAside
  }
}
</script>

<style lang='sass'>
#container
  display: flex
</style>