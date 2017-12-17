import axios from 'axios'
const baseUrl = ''
export default {
  getWechatSignature ({commit}, urlName) {
  	return axios.get(`${baseUrl}/wechat-signature?url=${urlName}`)
  }
}