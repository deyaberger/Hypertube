import { createRouter, createWebHistory } from 'vue-router'
import Sign_in from "../views/Sign_in.vue";
import Sign_up from "../views/Sign_up.vue";
import Reset_pwd from "../views/Reset_password.vue";
import New_pwd from "../views/New_password.vue";

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
  ]
})

export default router
