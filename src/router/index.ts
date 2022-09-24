import { createRouter, createWebHistory } from 'vue-router'
import Sign_in from "../views/Sign_in.vue";
import Sign_up from "../views/Sign_up.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ]
})

export default router
