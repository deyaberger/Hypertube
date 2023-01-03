import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
	  language         : 'eng',
	  lang_nb		   : 0,
	  language_options : ['eng', 'fr'],
    }
  },
  mutations: {
	SET_LANGUAGE(state, language) {
		state.language = language
		state.lang_nb = language == 'eng' ? 0 : 1
	},
  }
})


export default store
