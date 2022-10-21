<script>
import { ref, computed } from 'vue'
import { mapState, useStore } from 'vuex';

export default {
  data() {
    const store = useStore()
    return {
      visible: false,
	  eng_content : [
			"sign up", // 0
			"create a username:", // 1
			"username", // 2
			"Username already in use", // 3
			"Your first Name:", // 4
			"firstname", // 5
			"Please enter a first name", // 6
			"Your last Name:", // 7
			"lastname", // 8
			"Please enter a last name", // 9
			"Your email address:", // 10
			"Please enter a valid email address", // 11
			"Create a password:", // 12
			"password", // 13
			"Error: please follow the instructions", // 14
			"Or", // 15
			"Already have an account? Sign in", // 16
			"Sign up with ", // 17
			"Error: a password should contain at least: 8 character, including at least an alphabetical character, a numeric charater and an uppercase and a lowercase", // 18
		],
		fr_content : [
			"s'enregistrer", // 0
			"créer un pseudo:", // 1
			"pseudo", // 2
			"Pseudo déjà pris", // 3
			"Votre prénom:", // 4
			"prénom", // 5
			"Merci d'indiquer votre prénom", // 6
			"Votre nom de famille:", // 7
			"nomdefamille", // 8
			"Merci d'indiquer votre nom de famille", // 9
			"Adresse email:", // 10
			"Adresse invalide", // 11
			"Créer un mot de passe:", // 12
			"motdepasse", // 13
			"Erreur: merci de suivre les instructions", // 14
			"Ou", // 15
			"Déjà un compte? Se connecter", // 16
			"S'inscrire via ", // 17
			"Erreur: le mot de passe doit contenir au moins 8 characteres, numeriques et alphabetiques, en lettre majuscules et minuscules.", // 18
		],
    }
  },
  computed: mapState({
      username_error: state => state.username_error,
      firstname_error: state => state.firstname_error,
      lastname_error: state => state.lastname_error,
      email_error: state => state.email_error,
	  mdp_error: state => state.mdp_error,
      connection_error: state => state.connection_error,
	  language: state => state.language,
  }),
  methods: {
    password_visibility() {
    this.visible = !this.visible
    this.$store.commit('SET_WESH', 42)
  },
  is_english() {
		return (this.language == 'eng')
		},
		content(index) {
			if (this.is_english()) {
				return (this.eng_content[index])
			}
			else return (this.fr_content[index])
		}
  },
}
  </script>
  

<template>
   <div class="container home_made">
    <form>
      <h2 class="mb-4 text-center">{{content(0)}}:</h2>
      <div class="input mb-2">
        <label class = "mb-2" for="username">{{content(1)}}</label>
        <input
          class="form-control"
          :class="{ error_input : username_error}"
          type="text"
          name="username"
          :placeholder="content(2)"
        />
        <p class="error_msg" v-show="username_error">{{content(3)}}</p>
      </div>
      <div class="input mb-2">
        <label class = "mb-2" for="firstname">{{content(4)}}</label>
        <input
          class="form-control"
          :class="{ error_input : firstname_error}"
          type="text"
          name="firstname"
          :placeholder="content(5)"
        />
        <p class="error_msg" v-show="firstname_error">{{content(6)}}</p>
      </div>
      <div class="input mb-2">
        <label class = "mb-2" for="lastname">{{content(7)}}</label>
        <input
          class="form-control"
          :class="{ error_input : lastname_error}"
          type="text"
          name="lastname"
          :placeholder="content(8)"
        />
        <p class="error_msg" v-show="lastname_error">{{content(9)}}</p>
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="email">{{content(10)}}</label>
        <input
          class="form-control"
          :class="{ error_input : email_error}"
          type="text"
          name="email"
          placeholder="email@adress.com"
        />
        <p class="error_msg" v-show="email_error">{{content(11)}}</p>
      </div>
      <div class="input mt-2">
        <label class = "mb-2" for="password">{{content(12)}}</label>
        <div class="input-group">
        <input
          v-model = "password"
        class="form-control"
		:class="{ error_input : mdp_error}"
        :type="visible ? 'text' : 'password'"
        name="password"
        :placeholder="content(13)"
        >
        <span class="input-group-btn">
          <button class="btn" v-on:click="password_visibility" type="button">
            <b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
            <b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
          </button>
        </span>
        </div>
		<p class="error_msg" v-show="mdp_error">{{content(18)}}</p>
      </div>
      <div class="col-md-12 text-center mt-5">
        <p class="error_msg" v-show="connection_error">{{content(14)}}</p>
      <button class="submit_button" type="submit">{{content(0)}}</button>
      <div class = "m-3">{{content(15)}}</div>
      </div>
      <button class="mt-3 loginBtn loginBtn--facebook">
        {{content(17)}}Facebook
      </button>
      <span>
        <button class="loginBtn loginBtn--google">
			{{content(17)}}Google
        </button>
      </span>
      <button class="mt-3 loginBtn loginBtn--42">
        {{content(17)}}42
      </button>
      <span>
        <button class="mt-3 loginBtn loginBtn--twitter">
          {{content(17)}}twitter
        </button>
      </span>
      <div class="change_page mt-4 text-center">
      <router-link to="/sign_in">{{content(16)}}</router-link>
    </div>
    </form>
   </div>
</template>


<style scoped>

@import "../assets/shared_scss/login.scss";

.container {
  width: 530px;
}

.home_made {
	top: 450px;
}

</style>
