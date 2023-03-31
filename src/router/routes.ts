const rank = localStorage.getItem("rank");

export const routes = [
  {
    path: "/",
    redirect: rank
      ? rank == "admin"
        ? "/dashboard"
        : "/userHome"
      : "/userHome",
  },
  {
    path: "/",
    name: "home",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: "/userHome",
        name: "userHome",
        meta: {
          title: "系统首页",
          permiss: "1",
        },
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/home/userHome.vue"
          ),
      },
      {
        path: "/introduction",
        name: "introduction",
        meta: {
          title: "平台简介",
          permiss: "1",
        },
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/home/introduction.vue"
          ),
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
        path: "/safe",
        name: "safe",
        meta: {
          title: "警示标志",
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
      {
        path: "/laws",
        name: "laws",
        meta: {
          title: "安全法规",
          permiss: "3",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/laws.vue"),
      },
      {
        path: "/section",
        name: "section",
        meta: {
          title: "章节学习",
          permiss: "4",
        },
        component: () =>
          import(
            /* webpackChunkName: "tabs" */ "../views/curriculum/section.vue"
          ),
      },
      {
        path: "/appointment",
        name: "appointment",
        meta: {
          title: "预约申请",
          permiss: "5",
        },
        component: () =>
          import(
            /* webpackChunkName: "appointment" */ "../views/appointment.vue"
          ),
      },
      {
        path: "/list",
        name: "list",
        meta: {
          title: "在线考试",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "rule" */ "../views/exam/list.vue"),
      },
      {
        path: "/result/:paperId",
        name: "result",
        meta: {
          title: "考试结果",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "rule" */ "../views/exam/result.vue"),
      },
      {
        path: "/mistake",
        name: "mistake",
        meta: {
          title: "错题集",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "mistake" */ "../views/exam/mistake.vue"),
      },
      {
        path: "/preview/:examId",
        name: "preview",
        meta: {
          title: "开始考试",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "preview" */ "@/views/exam/preview.vue"),
      },
      {
        path: "/examUser",
        name: "examUser",
        meta: {
          title: "考试记录",
          permiss: "6",
        },
        component: () =>
          import(
            /* webpackChunkName: "table" */ "../views/admin/exam/examUser.vue"
          ),
      },
      {
        path: "/myScore",
        name: "myScore",
        meta: {
          title: "测试记录",
          permiss: "6",
        },
        component: () =>
          import(/* webpackChunkName: "rule" */ "../views/exam/myScore.vue"),
      },
      {
        path: "/message",
        name: "message",
        meta: {
          title: "留言/举报",
          permiss: "7",
        },
        component: () =>
          import(/* webpackChunkName: "message" */ "../views/message.vue"),
      },
      {
        path: "/tabs",
        name: "tabs",
        meta: {
          title: "留言/举报查看",
          permiss: "7",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/tabs.vue"),
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "个人中心",
          permiss: "8",
        },
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/user.vue"),
      },
      {
        path: "/tabs",
        name: "tabs",
        meta: {
          title: "留言/举报管理",
          permiss: "9",
        },
        component: () =>
          import(/* webpackChunkName: "tabs" */ "../views/tabs.vue"),
      },

      {
        path: "/userManage",
        name: "userManage",
        meta: {
          title: "用户管理",
          permiss: "10",
        },
        component: () =>
          import(
            /* webpackChunkName: "table" */ "../views/admin/user/manage.vue"
          ),
      },
      {
        path: "/rope",
        name: "rope",
        meta: {
          title: "题库管理",
          permiss: "11",
        },
        component: () =>
          import(
            /* webpackChunkName: "table" */ "../views/admin/exam/rope.vue"
          ),
      },
      {
        path: "/qu",
        name: "qu",
        meta: {
          title: "试题管理",
          permiss: "11",
        },
        component: () =>
          import(/* webpackChunkName: "table" */ "../views/admin/exam/qu.vue"),
      },
      {
        path: "/exam",
        name: "exam",
        meta: {
          title: "考试管理",
          permiss: "11",
        },
        component: () =>
          import(
            /* webpackChunkName: "table" */ "../views/admin/exam/exam.vue"
          ),
      },
      {
        path: "/examUser",
        name: "examUser",
        meta: {
          title: "考试详情",
          permiss: "11",
        },
        component: () =>
          import(
            /* webpackChunkName: "table" */ "../views/admin/exam/examUser.vue"
          ),
      },
      {
        path: "/chapterManager",
        name: "chapterManager",
        meta: {
          title: "主章节",
          premiss: "12",
        },
        component: () =>
          import(
            /* webpackChunkName: "chapterManager" */ "../views/chatper/chapterManager.vue"
          ),
      },
      {
        path: "/chapterSon",
        name: "chapterSon",
        meta: {
          title: "子章节",
          premiss: "12",
        },
        component: () =>
          import(
            /* webpackChunkName: "chapterSon" */ "../views/chatper/chapterSon.vue"
          ),
      },
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "首页",
          permiss: "13",
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/dashboard.vue"),
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
    path: "/startexam/:examId/:id",
    name: "startexam",
    meta: {
      title: "考试-进行中...",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/exam/exam.vue"),
    // 编写路由守卫，使其不能跳转其他界面
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
