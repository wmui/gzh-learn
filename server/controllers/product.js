import api from '../api'
export async function getProducts (ctx, next) {
  let { limit = 50 } = ctx.query
  const data = await api.product.getProducts(limit)
  ctx.body = {
    data: data,
    sucess: true
  }
}
export async function getProduct (ctx, next) {
  let { params: _id } = ctx
  if (!_id) {
    return (ctx.body = {
      success: false,
      err: '_id is required'
    })
  }

  const data = await api.product.getProduct(_id)
  ctx.body = {
    success: true,
    data: data
  }
}

export async function postProduct (ctx, next) {
  let product = ctx.request.body
  // 可以在这里做xss监测
  try {
    product = await api.product.saveProduct(product)
    ctx.body = {
      success: true,
      data: product
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
}

export async function patchProduct (ctx, next) {
  let body = ctx.request.body
  const { _id } = body
  if (!_id) {
    return (ctx.body = {
      success: false,
      err: '_id is required'
    })
  }

  let product = await api.product.getProduct(_id)
  if (!product) {
    ctx.body = {
      success: false,
      err: 'Product is not exist'
    }
  }

  // 更新商品
  try {
    body = await api.product.updateProduct(body)
    ctx.body = {
      success: true,
      data: body
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
}

export async function delProduct (ctx, next) {
  let { params: _id } = ctx
  if (!_id) {
    return (ctx.body = {
      success: false,
      err: '_id is required'
    })
  }

  let product = await api.product.getProduct(_id)
  if (!product) {
    return (ctx.body = {
      success: false,
      err: 'Product is not exist'
    })
  }

  try {
    let result = await api.product.delProduct(_id)
    ctx.body = {
      success: true,
      data: result
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      success: false,
      err: e
    }
  }
}
