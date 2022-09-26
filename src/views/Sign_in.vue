<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { mapState } from 'vuex';

export default {
  data() {
    const store = useStore()
    return {
      visible: false,
      username: '',
      password: '',
    }
  },
  computed: mapState({
      wesh: state => state.wesh,
      connection_error: state => state.connection_error,
  }),
  methods: {
    password_visibility() {
    this.visible = !this.visible
    // this.$store.commit('SET_WESH', 42)
  },
  },
}
  </script>
  

<template>
   <div class="container">
    <form>
      <h2 class="mb-4 text-center">Sign in:</h2>
      <div class="input mb-3">
        <label class = "mb-2" for="username">Username:</label>
        <input
          v-model = "username"
          class = "form-control"
          :class="{ error_input : connection_error}"
          type="text"
          name="username"
          placeholder="username"
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="password">Password:</label>
        <div class="input-group">
        <input
          v-model = "password"
        class="form-control"
        :class="{ error_input : connection_error}"
        :type="visible ? 'text' : 'password'"
        name="password"
        placeholder="password"
        >
        <span class="input-group-btn">
          <button class="btn" v-on:click="password_visibility" type="button">
            <b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
            <b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
          </button>
        </span>
        </div>
      </div>
      <div class="col-md-12 text-center" :class="{ 'mt-4' : connection_error, 'mt-5' : !connection_error }">
      <p class="error_msg" v-show="connection_error">Wrong username or password</p>
      <button class="submit_button" type="submit">Sign in</button>
      </div>
      <button class="mt-3 loginBtn loginBtn--facebook">
        Login with Facebook
      </button>
      <button class="mt-3 loginBtn loginBtn--google">
        Login with Google
      </button>
      <div class="change_page mt-3 text-center">
      <router-link to="/reset_pwd">Forgot your password?</router-link>
    </div>
      <div class="change_page mt-2 text-center">
      <router-link to="/sign_up">Don't have an account ? Sign up</router-link>
    </div>
    </form>
   </div>
</template>


<style >
@import "../assets/shared_scss/login.scss";

.loginBtn {
  box-sizing: border-box;
  position: relative;
  padding: 0 15px 0 46px;
  border: none;
  text-align: left;
  line-height: 34px;
  font-size: 16px;
  color: #FFF;
  display: inline-block;
}

.loginBtn:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 34px;
  height: 100%;
}

.loginBtn:focus {
  outline: none;
}
.loginBtn:active {
  box-shadow: inset 0 0 0 32px rgba(0,0,0,0.1);
}


/* Facebook */
.loginBtn--facebook {
  background-color: #4C69BA;
  background-image: linear-gradient(#4C69BA, #3B55A0);
  /*font-family: "Helvetica neue", Helvetica Neue, Helvetica, Arial, sans-serif;*/
  text-shadow: 0 -1px 0 #354C8C;
  width: 57%;
}

.loginBtn--facebook:before {
  border-right: #364e92 1px solid;
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/14082/icon_facebook.png') 6px 6px no-repeat;
}
.loginBtn--facebook:hover,
.loginBtn--facebook:focus {
  background-color: #5B7BD5;
  background-image: linear-gradient(#5B7BD5, #4864B1);
}

/* Google */
.loginBtn--google {
  /*font-family: "Roboto", Roboto, arial, sans-serif;*/
  background: #DD4B39;
  width: 57%;
}
.loginBtn--google:before {
  border-right: #BB3F30 1px solid;
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/14082/icon_google.png') 6px 6px no-repeat;
}
.loginBtn--google:hover,
.loginBtn--google:focus {
  background: #E74B37;
}

</style>
