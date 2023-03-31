<template>
  <div class="body">
    <div class="body-title">高校计算机实验室安全教育系统</div>
    <div class="main">
      <Switch />
      <Sign_up />
      <Sign_in />
    </div>
  </div>
</template>

<script setup lang="ts">
import Switch from "./login/Switch.vue";
import Sign_up from "./login/Sign_up.vue";
import Sign_in from "./login/Sign_in.vue";
import { ref } from "vue";
const loginFrom = ref();
</script>

<style scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

.body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  background: url("../assets/img/Main2.png") no-repeat center center;
  /* background-color: #ecf0f3; */
  color: #a0a5a8;
}
.body-title{
  position: absolute;
  top: 0;
  left: 25px;
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: left;
  font-size: 25px;
  font-weight: 700;
  color: #fff;
}
.main {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  /* box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9; */
  border-radius: 20px;
  overflow: hidden;
}
@media (max-width: 1200px) {
  .main {
    transform: scale(0.7);
  }
}
@media (max-width: 1000px) {
  .main {
    transform: scale(0.6);
  }
}
@media (max-width: 800px) {
  .main {
    transform: scale(0.5);
  }
}
@media (max-width: 600px) {
  .main {
    transform: scale(0.4);
  }
}
</style>
