<template>
</template>
<script>
// 这个页面时后端进行的重定向
// http://wmuigzh.free.ngrok.cc/oauth?code=071UxIyb1tgA9u0RJFxb18NMyb1UxIyJ&state=user

export default {
  head () {
    return {
      title: `loading`
    }
  },

  async beforeMount () {
    const urlName = window.location.href
    const data = await this.$store.dispatch('getUserByOAuth', urlName)
    console.log(data)

    if (data.success) {
      this.$store.commit('SET_AUTHUSER', data.data)
      // 当进入user路由时，如果未授权，那么路由重定向时把user携带到重定向地址上
      // 微信在进行二跳时，会把这些参数加到url中，我们就可以把授权通过后跳转带user页面
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
