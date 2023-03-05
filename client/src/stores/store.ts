import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'



const store = createStore({
	plugins: [
		createPersistedState({
        storage: window.sessionStorage,
    })
	],

  state() {
    return {
			language       : 'eng',
			lang_nb        : 0,
			user_connected : false,
			user_token     : null,
			user_id        : null,
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
		SET_USER_TOKEN(state, token) {
			state.user_token = token
		},
		SET_USER_ID(state, id) {
			state.user_id = id
		},
		LOGOUT_USER(state) {
			state.user_connected = false
			state.user_token = null
			state.user_id = null
		},
  }
})


export default store
