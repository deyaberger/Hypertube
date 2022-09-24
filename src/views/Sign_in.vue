<script>
  export default {
    data() {
      return {
        visible: false
      }
    },
    methods: {
    password_visibility() {
      this.visible = !this.visible
    }
  }
  }
  </script>
  

<template>
   <div class="container">
    <form>
      <h2 class="mb-4 text-center">Login</h2>
      <div class="input mb-3">
        <label class = "mb-2" for="username">Username:</label>
        <input
          class="form-control"
          type="text"
          name="username"
          placeholder="username"
        />
      </div>
      <div class="input mb-3">
        <label class = "mb-2" for="firstname">First Name:</label>
        <input
          class="form-control"
          type="text"
          name="firstname"
          placeholder="firstname"
        />
      </div>
      <div class="input mb-3">
        <label class = "mb-2" for="lastname">Last Name:</label>
        <input
          class="form-control"
          type="text"
          name="lastname"
          placeholder="lastname"
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="email">Your email address:</label>
        <input
          class="form-control"
          type="text"
          name="email"
          placeholder="email@adress.com"
        />
      </div>
      <div class="input mt-5">
        <label class = "mb-2" for="password">Create password:</label>
        <div class="input-group">
        <input v-if="visible" type="password" class="form-control pwd" value="iamapassword">
        <input v-else type="text" class="form-control pwd" value="iamapassword">
        <span class="input-group-btn">
          <button class="btn btn-default reveal" v-on:click="password_visibility" type="button">
            <b-icon-eye-fill v-if="visible"></b-icon-eye-fill>
            <b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
          </button>
        </span>
        </div>
      </div>
    </form>
   </div>
</template>


<style scoped>

.container {
  width: 400px;
  max-width: 95%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgb(40, 37, 37);
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #191818ed;
}

.input-group-btn{
  background-color: white;
  border-radius: 5px;
}

.input-group-btn:hover {
  background-color: rgb(201, 195, 195);
}

.btn-default:hover {
  color: black
}

</style>
