<template>
</template>
<script>
// 这个页面时后端进行的重定向
function getUrlParam (param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)

  return result ? decodeURIComponent(result[2]) : null
}

export default {
  head () {
    return {
      title: `loading`
    }
  },

  async beforeMount () {
    const urlName = window.location.href
    const { data } = await this.$store.dispatch('getUserByOAuth', urlName)
    console.log(data)

    if (data.success) {
      this.$store.commit('setAuthUser', data.data)
      const paramsArr = getUrlParam('state').split('_')
      const visit = paramsArr.length === 1 ? `/${paramsArr[0]}` : `/${paramsArr[0]}?id=${paramsArr[1]}`

      this.$router.replace(visit)
    } else {
      throw new Error('用户信息获取失败')
    }
  },

  /* beforeMount () {
    const url = window.location.href
    this.$store.dispatch('getUserByOAuth', url).then(res => {
      if (res.data.success) {
        console.log(res.data)
      }
    })
  } */
}
</script>
