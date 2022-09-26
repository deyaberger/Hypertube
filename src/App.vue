<script>
import { RouterLink, RouterView } from 'vue-router'
import Nav from './components/Nav.vue'
export default {
	components: {
		Nav
	},
	data() {
		return {
			test : false
		}
	}
}
</script>

<template>
  <div id="app">
	<Nav />
    <router-view />
  </div>
</template>


<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");

:root {
  --font: Roboto, sans-serif;
  --textColor: #f6f8fc;
  // --linkActiveColor: #41b783;
  // background-color : #112d66;
	background-image: url('./assets/background2.jpg');
}

#app {
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--textColor);

}

</style>
