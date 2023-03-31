<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
                v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item
                v-else
                :index="subItem.index"
                v-permiss="item.permiss"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";

const items = [
  {
    icon: "House",
    index: "/userHome",
    title: "首页",
    permiss: "1",
  },
  {
    icon: "House",
    index: "/dashboard",
    title: "系统首页",
    permiss: "12",
  },
  {
    icon: "Monitor",
    index: "/equipment",
    title: "设备展示",
    permiss: "2",
  },
  {
    icon: "memo",
    index: "1",
    title: "警示教育",
    permiss: "2",
    subs: [
      {
        index: "/rule",
        title: "规章制度",
        permiss: "2",
      },
      {
        index: "/safe",
        title: "警示标志",
        permiss: "2",
      },
      {
        index: "/laws",
        title: "安全法规",
        permiss: "3",
      },
    ],
  },
  {
    icon: "Reading",
    index: "/section",
    title: "在线学习",
    permiss: "4",
  },
  {
    icon: "timer",
    index: "/appointment",
    title: "预约申请",
    permiss: "5",
  },
  {
    icon: "list",
    index: "3",
    title: "测试与考核",
    permiss: "6",
    subs: [
      {
        index: "/list",
        title: "在线考试",
        permiss: "6",
      },
      {
        index: "/myScore",
        title: "测试记录",
        permiss: "6",
      },
    ],
  },
  {
    icon: "Operation",
    index: "4",
    title: "考试管理",
    permiss: "11",
    subs: [
      {
        index: "/rope",
        title: "题库管理",
        permiss: "11",
      },
      {
        index: "/qu",
        title: "试题管理",
        permiss: "11",
      },
      {
        index: "/exam",
        title: "考试管理",
        permiss: "11",
      },
    ],
  },
  {
    icon: "message",
    index: "/message",
    title: "留言/举报",
    permiss: "7",
  },
  {
    icon: "promotion",
    index: "/introduction",
    title: "平台简介",
    permiss: "1",
  },
  {
    icon: "user",
    index: "/userManage",
    title: "用户管理",
    permiss: "10",
  },
  {
    icon: "DocumentCopy",
    index: "5",
    title: "章节管理",
    permiss: "12",
    subs: [
      {
        index: "/chapterManager",
        title: "主章节",
        permiss: "12",
      },
      {
        index: "/chapterSon",
        title: "子章节",
        permiss: "12",
      },
    ],
  },
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
