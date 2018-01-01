export default function ({ store, route, redirect }) {
  if (!store.state.authUser) {
    let { fullPath } = route
    // user页面的fullpath：/user
    fullPath = encodeURIComponent(fullPath.substr(1))
    // 重定向实际发送了一个get请求，后端解析该url后，跳转到微信授权页
    return redirect(`/wechat-redirect?visit=${fullPath}`)
  }
}
