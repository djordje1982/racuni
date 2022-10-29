import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";
import HomeView from "../views/HomeView.vue";
import RacuniView from "../views/RacuniView.vue";
import RacunDetails from "../views/RacunDetails.vue";
import PoveriociView from "../views/PoveriociView.vue";
import DashboardView from "../views/DashboardView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import UserView from "../views/UserView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup/",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/user/",
    name: "user",
    component: UserView,
    beforeEnter: async (to, from, next) => {
      await store.dispatch("actGetUser");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/bills/",
    name: "bills",
    component: RacuniView,
    beforeEnter: async (to, from, next) => {
      await store.dispatch("actZaRacune");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/bills/:racunId",
    name: "billDetails",
    component: RacunDetails,
    meta: {
      requiresAuth: true,
    },
    props: true,
    beforeEnter: async (to, from, next) => {
      await store.dispatch("actZaRacune");
      next();
    },
  },
  {
    path: "/creditors/",
    name: "creditors",
    component: PoveriociView,
    beforeEnter: async (to, from, next) => {
      await store.dispatch("actGetPoverioci");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard/",
    name: "dashboard",
    component: DashboardView,
    beforeEnter: async (to, from, next) => {
      await store.dispatch("actGraf");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = store.getters.TOKEN;
  if (to.meta.requiresAuth && !token) {
    store.commit("mutObavestenjeLogin");
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;
