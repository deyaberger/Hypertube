import Vue from "vue";
import VueRouter from "vue-router";
import Sign_up from "../views/Sign_up.vue";
import Sign_in from "../views/Sign_in.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Sign up",
    component: Sign_up,
  },
  {
    path: "/sign_in",
    name: "Sign in",
    component: Sign_in,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
