import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      user_connected   : true,
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
    }
  },
  mutations: {
    SET_CONNECTION(state, bool) {
      state.user_connected = bool
    },
    SET_USERNAME(state, username) {
      state.username = username
    },
	SET_FIRSTNAME(state, firstname) {
		state.firstname = firstname
	},
	SET_LASTNAME(state, lastname) {
	state.lastname = lastname
	},
	SET_EMAIL(state, email) {
		state.email = email
	},
	SET_LANGUAGE(state, language) {
		state.language = language
	},
  }
})


export default store
