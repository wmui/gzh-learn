export default function ({ store, route, redirect }) {
  if (!store.state.authUser) {
    let { fullPath } = route
    // aouth页面的fullpath：/oauth
    fullPath = encodeURIComponent(fullPath.substr(1))
    // 重定向实际发送了一个get请求
    return redirect(`/wechat-redirect?visit=${fullPath}`)
  }
}
