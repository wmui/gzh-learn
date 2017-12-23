import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default () => {
  return new Vuex.Store({
    state: {
			characters: [],
			cities: [],
			houses:[]
    },
    getters,
    mutations,
    actions
  })
}
