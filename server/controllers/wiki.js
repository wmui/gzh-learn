import api from '../api'
export async function getHouses(ctx, next) {
  const data = await api.wiki.getHouses()
  ctx.body = {
    data: data,
    sucess: true
  }
}

export async function getHouse(ctx, next) {
  const { params } = ctx
  const { _id } = params

  if (!_id) return (ctx.body = { succes: false, err: '_id is required' })

  const data = await api.wiki.getHouse(_id)

  ctx.body = {
    data: data,
    sucess: true
  }

}

export async function getCharacters(ctx, next) {

  let { limit = 20 } = ctx.query

  const data = await api.wiki.getCharacters(limit)

  ctx.body = {
    data: data,
    sucess: true
  }
}

export async function getCharacter(ctx, next) {
  const { params } = ctx
  const { _id } = params

  if (!_id) return (ctx.body = { succes: false, err: '_id is required' })

  const data = await api.wiki.getCharacter(_id)

  ctx.body = {
    data: data,
    sucess: true
  }
}
