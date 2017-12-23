import axios from 'axios'
const baseUrl = ''
const apiUrl = 'http://rap.taobao.org/mockjsdata/30371'
export default {
  getWechatSignature ({commit}, urlName) {
  	return axios.get(`${baseUrl}/wechat-signature?url=${urlName}`)
  },

  getUserByOAuth ({commit},urlName) {
  	return axios.get(`${baseUrl}/wechat-oauth?url=${urlName}`)
  },

  async fetchCharacters ({state}, id) {
  	const { data } = await axios.get(`${apiUrl}/wiki/characters/${id}`)
  	state.characters = data
  	return data
  },

  async fetchCities ({state}, id) {
  	const { data } = await axios.get(`${apiUrl}/wiki/cities`)
  	state.cities = data
  	return data
  },

  async fetchHouses ({state}, id) {
  	const { data } = await axios.get(`${apiUrl}/wiki/houses`)
  	state.houses = data
  	return data
  },
}