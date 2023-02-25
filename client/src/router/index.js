import { createRouter, createWebHistory } from 'vue-router'
import Sign_in          from "../views/Sign_in.vue";
import Sign_up          from "../views/Sign_up.vue";
import Reset_pwd        from "../views/Reset_password.vue";
import New_pwd          from "../views/New_password.vue";
import Search           from "../views/Search.vue";
import Profile          from "../views/Profile.vue";
import SingleMovie      from "../views/Single_movie.vue";
import My_profile       from "../views/My_profile.vue";
import Populate         from "../views/Populate.vue";
import MovieTorrents    from "../views/Movie_torrents.vue";



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
			props: route => ({ oauth_token: route.query.oauth_token })
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
			path: "/my_profile",
			name: "edit",
			component: My_profile,
		},
		{
			path: "/profile/:user_id",
			name: "profile",
			props: true,
			component: Profile,
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
		{
			path: "/movie_torrents/:movie_id",
			name: "movie_torrents",
			props: true,
			component: MovieTorrents,
		},
  ]
})


export default router
