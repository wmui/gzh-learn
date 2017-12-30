<template>
<div class="container">
  <div class="card">
    <div class="card-header">
      <div class="card-inner">登录</div>
    </div>
    <div class="card-body">
      <div class="form">
        <input type="text" class="form-control" v-model='user.email'>
        <input type="password" class="form-control" v-model='user.password'>
        <button class="btn login-btn" @click='login'>LOGIN</button>
      </div>
    </div>
  </div>
  <v-snackbar :open.sync='openSnackbar'></v-snackbar>
 </div>
</template>

<script>
import vSnackbar from '~/components/snackbar'

export default {
  data () {
    return {
      user: {},
      openSnackbar: false
    }
  },

  methods: {
    async login () {
      let { email, password } = this.user

      if (!email || !password) {
        this.openSnackbar = true

        return ''
      }

      let res = await this.$store.dispatch('login', this.user)

      if (res.success) this.$router.push('/admin/products')
    }
  },

  components: {
    vSnackbar
  }
}
</script>


<style scoped lang='sass' src='~/static/sass/admin.sass'></style>
