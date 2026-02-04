import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("../pages/auth/LoginPage.vue"),
    },
    {
      path: "/",
      name: "Dashboard",
      component: () => import("../pages/dashboard/DashboardPage.vue"),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
