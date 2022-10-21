import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      user_connected   : false,
      username         : '',
      username_error   : false,
      firstname        : '',
      firstname_error  : false,
      lastname         : '',
      lastname_error   : false,
      email            : '',
      email_error      : false,
      password         : '',
      mdp_error        : false,
      connection_error : false,
	  language         : 'eng',
	  language_options : ['eng', 'fr'],
      wesh             : "heyyy"
    }
  },
  mutations: {
    SET_CONNECTION(state, bool) {
      state.user_connected = bool
    },
    SET_USERNAME(state, username) {
      state.username = username
    },
	SET_LANGUAGE(state, language) {
		state.language = language
	},
    SET_WESH(state, wesh) {
      state.wesh = wesh
    }
  }
})


export default store
