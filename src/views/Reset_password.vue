<template>
	<div class="container home_made">
	<form>
		<h2 class="text-center">Forgot your password?</h2>
		<p class="text-center">Enter your email adress. If you have an account, you will receive a link to reset your password</p>
		<div class="input mt-5">
        <label class = "mb-2" for="email">Email address:</label>
        <input
          class="form-control"
          type="text"
          name="email"
          placeholder="email@adress.com"
        />
      </div>
		<div class="col-md-12 text-center mt-4">
		<button class="submit_button" type="submit">Send</button>
		</div>
	</form>
	</div>
</template>


<style >
@import "../assets/shared_scss/login.scss";

.container {
	width: 500px;
}

h2 {
	font-size: 25px;
}

p {
	letter-spacing: 0px;
	text-transform: none;
	font-size: 15px;
}

</style>
