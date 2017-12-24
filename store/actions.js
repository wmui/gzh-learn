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
  }
}
