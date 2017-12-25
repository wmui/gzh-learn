import axios from 'axios'
const baseUrl = ''
export default {
  getWechatSignature ({ commit }, urlName) {
    return axios.get(`${baseUrl}/wechat-signature?url=${urlName}`)
  },

  getUserByOAuth ({ commit }, urlName) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${urlName}`)
  },

  async fetchCharacters ({ state }) {
    const { data } = await axios.get(`${baseUrl}/wiki/characters`)
    state.characters = data.data
    return data
  },

  async fetchHouses ({ state }) {
    const { data } = await axios.get(`${baseUrl}/wiki/houses`)
    state.houses = data.data
    return data
  },

  async showCharacter ({state}, id) {
    const { data } = await axios.get(`${baseUrl}/wiki/character/${id}`)
    state.currentCharacter = data.data
    return data
  },

  async showHouse ({state}, id) {
    const { data } = await axios.get(`${baseUrl}/wiki/house/${id}`)
    state.currentHouse = data.data
    return data
  },

  async fetchProducts ({ state }) {
    const { data } = await axios.get(`${baseUrl}/shop/products`)

    state.products = data.data

    return data
  },

  async showProduct ({ state }, _id) {
    if (_id === state.currentProduct._id) return

    const {data} = await axios.get(`${baseUrl}/shop/product/${id}`)
    state.currentProduct = data.data

    return data
  },


  async saveProduct ({ state, dispatch }, product) {
    // console.log(product)
    const { data } = await axios.post('/shop/product', product)

    const res= await dispatch('fetchProducts')
    return res.data
  },

  async patchProduct ({ state, dispatch }, product) {
    // console.log('patchProduct')
    const { data } = await axios.patch('/shop/product', product)
    console.log(data)
    let res = await dispatch('fetchProducts')
    return res.data
  },

  async deleteProduct ({ state, dispatch }, product) {
    const { data } = await axios.delete(`${baseUrl}/shop/product/${product._id}`)
    console.log(data)
    let res = await dispatch('fetchProducts')
    return res.data
  }
}
