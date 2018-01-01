import axios from 'axios'
const baseUrl = ''
export default {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.user) {
      const { email, nickname, avatarUrl } = req.session.user
      const user = {
        email,
        nickname,
        avatarUrl
      }

      commit('SET_USER', user)
    }
  },

  async login ({ commit }, { email, password }) {
    try {
      let res = await axios.post('/admin/login', {
        email,
        password
      })
      const { data } = res
      if (data.success) commit('SET_USER', data.data)
      return data
    } catch (e) {
      if (e.response.status === 401) {
        throw new Error('来错地方了')
      }
    }
  },

  async logout ({ commit }) {
    await axios.post('/admin/logout')
    commit('SET_USER', null)
  },
  
  // 获取所有已支付订单列表
  async fetchPayments ({ state }) {
    let { data } = await axios.get(`${baseUrl}/admin/payments`)
    state.payments = data.data
    return data
  },

  // 获取某个用户信息和订单，暂未实现
  async fetchUserAndOrders ({ state }) {
    const { data } = await axios.get(`${baseUrl}/admin/user`)
    state.user = data.data
    return data
  },

  // 创建支付订单
  async createOrder ({ state }, { productId, name, address, phoneNumber }) {
    const { data } = axios.post(`${baseUrl}/wechat-pay`, {
      productId,
      name,
      address,
      phoneNumber
    })
    return data
  },

  // 获取公众号签名，用于调用微信sdk
  async getWechatSignature ({ commit }, urlName) {
    const { data } = await axios.get(`${baseUrl}/wechat-signature?url=${urlName}`)
    return data
  },

  // 通过code获取用户信息
  async getUserByOAuth ({ commit }, urlName) {
    const { data } = await axios.get(`${baseUrl}/wechat-oauth?url=${urlName}`)
    return data
  },

  // 人物列表
  async fetchCharacters ({ state }) {
    const { data } = await axios.get(`${baseUrl}/wiki/characters`)
    state.characters = data.data
    return data
  },

  // 家族列表
  async fetchHouses ({ state }) {
    const { data } = await axios.get(`${baseUrl}/wiki/houses`)
    state.houses = data.data
    return data
  },

  // 某个人物
  async showCharacter ({ state }, id) {
    const { data } = await axios.get(`${baseUrl}/wiki/character/${id}`)
    state.currentCharacter = data.data
    return data
  },

  // 某个家族
  async showHouse ({ state }, id) {
    const { data } = await axios.get(`${baseUrl}/wiki/house/${id}`)
    state.currentHouse = data.data
    return data
  },

  // 商品列表
  async fetchProducts ({ state }) {
    const { data } = await axios.get(`${baseUrl}/shop/products`)
    state.products = data.data
    return data
  },

  // 获取某个商品的详细信息
  async showProduct ({ state }, _id) {
    if (_id === state.currentProduct._id) return
    const { data } = await axios.get(`${baseUrl}/shop/product/${_id}`)
    // console.log(data)
    state.currentProduct = data.data
    return data
  },

  // 添加商品
  async saveProduct ({ state, dispatch }, product) {
    // console.log(product)
    await axios.post(`${baseUrl}/shop/product`, product)
    const { data } = await dispatch('fetchProducts')
    return data
  },

  // 更新商品
  async patchProduct ({ state, dispatch }, product) {
    // console.log('patchProduct')
    await axios.patch(`${baseUrl}/shop/product`, product)
    const { data } = await dispatch('fetchProducts')
    return data
  },

  // 删除商品
  async deleteProduct ({ state, dispatch }, product) {
    await axios.delete(`${baseUrl}/shop/product/${product._id}`)
    // 商品删除后重新获取列表
    const { data } = await dispatch('fetchProducts')
    return data
  }
}
