import mongoose from 'mongoose'
const Product = mongoose.model('Product')

export async function getProducts (limit = 50) {
  const data = await Product
    .find({})
    .limit(Number(limit))
    .exec()

  return data
}

export async function getProduct (_id) {
  const data = await Product
    .findOne({ _id: _id })
    .exec()

  return data
}

export async function saveProduct (product) {
  product = new Product(product)
  product = await product.save()
  return product
}

export async function updateProduct (product) {
  let { _id } = product
  let result = await Product.findByIdAndUpdate(_id, product).exec()
  return result
}

export async function delProduct (_id) {
  let result = await Product.findByIdAndRemove(_id).exec()
  return result
}
