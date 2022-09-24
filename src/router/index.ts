import { createRouter, createWebHistory } from 'vue-router'
import Sign_up from "../views/Sign_up.vue";
import Sign_in from "../views/Sign_in.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Sign up",
      component: Sign_up,
    },
    {
      path: "/sign_in",
      name: "Sign in",
      component: Sign_in,
    }
  ]
})

export default router
