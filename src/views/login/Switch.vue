<template>
  <div class="switch" id="switch-cnt">
    <div class="switch__circle"></div>
    <div class="switch__circle switch__circle--t"></div>
    <div class="switch__container" id="switch-c1">
      <h2 class="switch__title title">Welcome Back !</h2>
      <p class="switch__description description">
        一起加入计算机实验室安全教育系统学习吧
      </p>
      <button class="switch__button button switch-btn" @click="change">
        已有账号，马上登录
      </button>
    </div>
    <div class="switch__container is-hidden" id="switch-c2">
      <h2 class="switch__title title">Hello Friend !</h2>
      <p class="switch__description description">
        欢迎回到计算机实验室安全教育系统
      </p>
      <button class="switch__button button switch-btn" @click="change">
        去注册
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useEmitter from "../../hooks/useEmitter";

const sidebarOpen = ref(true);
const emitter = useEmitter();

const change = () => {
  const switchC1 = document.querySelector("#switch-c1") as any;
  const switchC2 = document.querySelector("#switch-c2") as any;
  const switchCircle = document.querySelectorAll(".switch__circle") as any;
  const switchCtn = document.querySelector("#switch-cnt") as any;
  switchCtn.classList.add("is-gx");
  setTimeout(function () {
    switchCtn.classList.remove("is-gx");
  }, 1500);
  switchCtn.classList.toggle("is-txr");
  switchCircle[0].classList.toggle("is-txr");
  switchCircle[1].classList.toggle("is-txr");
  switchC1.classList.toggle("is-hidden");
  switchC2.classList.toggle("is-hidden");

  sidebarOpen.value = !sidebarOpen.value;
  emitter.emit("change", sidebarOpen.value);
};
</script>

<style scoped>
@import "../../assets/css/login.css";
</style>
