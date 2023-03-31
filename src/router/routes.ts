export const adminRoutes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/",
    name: "home",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
          permiss: "1",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
      },
      {
        path: "/equipment",
        name: "equipment",
        meta: {
          title: "设备展示",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/equipment.vue"),
      },
      {
        path: "/charts",
        name: "basecharts",
        meta: {
          title: "图表",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "charts" */ "../views/charts.vue"),
      },
      {
        path: "/form",
        name: "baseform",
        meta: {
          title: "表单",
          permiss: "5",
        },
        component: () =>
          import(/* webpackChunkName: "form" */ "../views/form.vue"),
      },
      {
        path: "/tabs",
        name: "tabs",
        meta: {
          title: "tab标签",
          permiss: "3",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/tabs.vue"),
      },
      {
        path: "/permission",
        name: "permission",
        meta: {
          title: "权限管理",
          permiss: "13",
        },
        component: () =>
          import(
            /* webpackChunkName: "permission" */ "../views/permission.vue"
          ),
      },
      {
        path: "/message",
        name: "message",
        meta: {
          title: "留言/举报",
          permiss: "13",
        },
        component: () =>
          import(/* webpackChunkName: "permission" */ "../views/message.vue"),
      },
      {
        path: "/appointment",
        name: "appointment",
        meta: {
          title: "预约申请",
          permiss: "13",
        },
        component: () =>
          import(
            /* webpackChunkName: "permission" */ "../views/appointment.vue"
          ),
      },
      {
        path: "/upload",
        name: "upload",
        meta: {
          title: "上传插件",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "upload" */ "../views/upload.vue"),
      },
      {
        path: "/icon",
        name: "icon",
        meta: {
          title: "自定义图标",
          permiss: "10",
        },
        component: () =>
          import(/* webpackChunkName: "icon" */ "../views/icon.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "个人中心",
        },
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user.vue"),
      },
      {
        path: "/editor",
        name: "editor",
        meta: {
          title: "富文本编辑器",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "editor" */ "../views/editor.vue"),
      },
      {
        path: "/markdown",
        name: "markdown",
        meta: {
          title: "markdown编辑器",
          permiss: "9",
        },
        component: () =>
          import(/* webpackChunkName: "markdown" */ "../views/markdown.vue"),
      },
      {
        path: "/safe",
        name: "safe",
        meta: {
          title: "安全警示",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "export" */ "../views/safe.vue"),
      },
      {
        path: "/rule",
        name: "rule",
        meta: {
          title: "规章制度",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "rule" */ "../views/rule.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录/注册",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
  },
  {
    path: "/403",
    name: "403",
    meta: {
      title: "没有权限",
    },
    component: () => import(/* webpackChunkName: "403" */ "../views/403.vue"),
  },
];

export const userRoutes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
          permiss: "1",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
      },
      {
        path: "/equipment",
        name: "equipment",
        meta: {
          title: "设备展示",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/equipment.vue"),
      },
      {
        path: "/charts",
        name: "basecharts",
        meta: {
          title: "图表",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "charts" */ "../views/charts.vue"),
      },
      {
        path: "/form",
        name: "baseform",
        meta: {
          title: "表单",
          permiss: "5",
        },
        component: () =>
          import(/* webpackChunkName: "form" */ "../views/form.vue"),
      },
      {
        path: "/tabs",
        name: "tabs",
        meta: {
          title: "tab标签",
          permiss: "3",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/tabs.vue"),
      },
      {
        path: "/permission",
        name: "permission",
        meta: {
          title: "权限管理",
          permiss: "13",
        },
        component: () =>
          import(
            /* webpackChunkName: "permission" */ "../views/permission.vue"
          ),
      },
      {
        path: "/message",
        name: "message",
        meta: {
          title: "留言/举报",
          permiss: "13",
        },
        component: () =>
          import(/* webpackChunkName: "permission" */ "../views/message.vue"),
      },
      {
        path: "/upload",
        name: "upload",
        meta: {
          title: "上传插件",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "upload" */ "../views/upload.vue"),
      },
      {
        path: "/icon",
        name: "icon",
        meta: {
          title: "自定义图标",
          permiss: "10",
        },
        component: () =>
          import(/* webpackChunkName: "icon" */ "../views/icon.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "个人中心",
        },
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user.vue"),
      },
      {
        path: "/editor",
        name: "editor",
        meta: {
          title: "富文本编辑器",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "editor" */ "../views/editor.vue"),
      },
      {
        path: "/markdown",
        name: "markdown",
        meta: {
          title: "markdown编辑器",
          permiss: "9",
        },
        component: () =>
          import(/* webpackChunkName: "markdown" */ "../views/markdown.vue"),
      },
      {
        path: "/safe",
        name: "safe",
        meta: {
          title: "安全警示",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "export" */ "../views/safe.vue"),
      },
      {
        path: "/rule",
        name: "rule",
        meta: {
          title: "规章制度",
          permiss: "2",
        },
        component: () =>
          import(/* webpackChunkName: "rule" */ "../views/rule.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录/注册",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
  },
  {
    path: "/403",
    name: "403",
    meta: {
      title: "没有权限",
    },
    component: () => import(/* webpackChunkName: "403" */ "../views/403.vue"),
  },
];
