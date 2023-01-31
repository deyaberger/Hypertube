import { createRouter, createWebHistory } from 'vue-router'
import Sign_in from "../views/Sign_in.vue";
import Sign_up from "../views/Sign_up.vue";
import Reset_pwd from "../views/Reset_password.vue";
import New_pwd from "../views/New_password.vue";
import Search from "../views/Search.vue";
import Profile from "../views/Profile.vue";
import SingleMovie from "../views/Single_movie.vue";
import Edit_profile from "../views/Edit_profile.vue";
import Populate from "../views/Populate.vue";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Sign_in,
    },
    {
      path: "/sign_in",
      name: "sign_in",
      component: Sign_in,
    },
    {
      path: "/sign_up",
      name: "sign_up",
      component: Sign_up,
    },
    {
      path: "/reset_pwd",
      name: "reset_pwd",
      component: Reset_pwd,
    },
    {
      path: "/new_pwd",
      name: "new_pwd",
      component: New_pwd,
    },
	{
		path: "/search",
		name: "search",
		component: Search,
	},
	{
		path: "/profile",
		name: "profile",
		component: Profile,
	},
	{
		path: "/edit_profile",
		name: "edit",
		component: Edit_profile,
	},
	{
		path: "/movie/:movie_id",
		name: "movie",
		props: true,
		component: SingleMovie,
	},
	{
		path: "/populate",
		name: "populate",
		component: Populate,
	},

  ]
})


export default router
