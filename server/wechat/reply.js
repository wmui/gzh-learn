const tip = 'hello world'
export default function (ctx, next) {
  const message = ctx.weixin
  console.log(message)
  ctx.body = tip
}
