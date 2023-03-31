import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { usePermissStore } from "../store/permiss";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  const rank = localStorage.getItem("rank");
  const permiss = usePermissStore();
  console.log(to.path, to.meta.permiss, permiss.key);

  if (to.path === "/login") {
    if (rank) {
      next(from.path);
    } else {
      next();
    }
  }
  if (!rank && to.path !== "/login") {
    next("/login");
  } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
    // 如果没有权限，则进入403
    next("/403");
  } else {
    next();
  }
});

export default router;
