import { createRouter, createWebHistory } from 'vue-router'
import Sign_in          from "../views/Sign_in.vue";
import Sign_up          from "../views/Sign_up.vue";
import Forgot_pwd        from "../views/Forgot_password.vue";
import reset_pwd          from "../views/Reset_password.vue";
import Search           from "../views/Search.vue";
import Profile          from "../views/Profile.vue";
import SingleMovie      from "../views/Single_movie.vue";
import My_profile       from "../views/My_profile.vue";
import Populate         from "../views/Populate.vue";
import NotFound         from "../views/NotFound.vue";
import MovieTorrents    from "../views/Movie_torrents.vue";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
	{
        path: "/:catchAll(.*)",
        name:'NotFound',
        component: NotFound
	},
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
      path: "/forgot_pwd",
      name: "forgot_pwd",
      component: Forgot_pwd,
    },
    {
      path: "/reset_pwd",
      name: "reset_pwd",
      component: reset_pwd,
    },
		{
			path: "/search",
			name: "search",
			component: Search,
			meta: { requiresAuth: true }
		},
		{
			path: "/profile",
			name: "profile",
			component: Profile,
			meta: { requiresAuth: true }
		},
		{
			path: "/my_profile",
			name: "edit",
			component: My_profile,
			meta: { requiresAuth: true }
		},
		{
			path: "/profile/:user_id",
			name: "profile",
			props: true,
			component: Profile,
			meta: { requiresAuth: true }
		},
		{
			path: "/movie/:movie_id",
			name: "movie",
			props: true,
			component: SingleMovie,
			meta: { requiresAuth: true }
		},
		{
			path: "/populate",
			name: "populate",
			component: Populate,
		},
		{
			path: "/movie_torrent/:movie_id",
			name: "movie_torrent",
			props: true,
			component: MovieTorrents,
		},
  ]
})


export default router
