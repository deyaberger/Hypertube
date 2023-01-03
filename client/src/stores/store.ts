import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
	  language         : 'eng',
	  lang_nb		   : 0,
	  user_connected   : false,
    }
  },
  mutations: {
	SET_LANGUAGE(state, language) {
		state.language = language
		state.lang_nb = language == 'eng' ? 0 : 1
	},
	SET_CONNECTION(state, connection_status) {
		state.user_connected = connection_status
	},
  }
})


export default store
