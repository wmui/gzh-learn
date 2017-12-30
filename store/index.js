import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default () => {
  return new Vuex.Store({
    state: {
      imageCDN: 'http://osmai097y.bkt.clouddn.com/',
      characters: [],
      houses: [],
      products: [],
      currentCharacter: {},
      currentHouse: {},
      currentProduct: {},
      authUser: {},
      user: {}
    },
    getters,
    mutations,
    actions
  })
}
