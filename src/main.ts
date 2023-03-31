import { createApp } from "vue";
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";
import router from "./router";
import { usePermissStore } from "./store/permiss";
import "element-plus/dist/index.css";
import "./assets/css/icon.css";
import mitt from "mitt";
import piniaPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App);
app.config.globalProperties.emitter = mitt();
app.use(createPinia());
app.use(router);
app.use(pinia);

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive("permiss", {
  mounted(el, binding) {
    if (!permiss.key.includes(String(binding.value))) {
      el["hidden"] = true;
    }
  },
});

app.mount("#app");
