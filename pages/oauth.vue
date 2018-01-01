<template>
</template>
<script>
// 这个页面是微信进行的重定向，能进入到这里说明用户同意了授权
// http://ngrok.86886.wang/oauth?code=071UxIyb1tgA9u0RJFxb18NMyb1UxIyJ&state=user
// 这个组件的作用就是获取用户信息并重定向，比如你在user页面触发了授权，那么就重定向到user页面

export default {
  head () {
    return {
      title: `loading`
    }
  },

  async beforeMount () {
    const urlName = window.location.href
    // 拿到用户信息
    const data = await this.$store.dispatch('getUserByOAuth', urlName)
    // console.log(data)

    if (data.success) {
      this.$store.commit('SET_AUTHUSER', data.data)
      let path
      const paramsArr = urlName.split('state=')
      const getParams = paramsArr[paramsArr.length - 1]
      const params = getParams.split('_')
      if (params.length > 1) {
        path = `/${params[0]}/${params[1]}`
      } else {
        path = `/${params[0]}`
      }
      this.$router.replace(path)
    } else {
      throw new Error('用户信息获取失败')
    }
  }
}
</script>
