<template>
  <span style="color: #ff0000; font-weight: 700">{{ min }}分钟{{ sec }}秒</span>
</template>

<script setup lang="ts" name="ExamTimer">
import { defineProps, onMounted, ref, watch } from "vue";
// 获取props数据
const props = defineProps({
  // 倒计时时间
  leftSeconds: {
    type: Number,
    default: 0,
  },
});

// 定义Number类型的变量
const leftSeconds = ref(0);
const min = ref("00");
const sec = ref("00");

onMounted(() => {
  leftSeconds.value = props.leftSeconds;
  time();
});

watch(
  () => props.leftSeconds,
  (val) => {
    leftSeconds.value = val;
    countdown();
  }
);

const emit = defineEmits(["timeout"]);

function countdown() {
  if (leftSeconds.value < 0) {
    return;
  }
  // 分，转换为整数
  const mine = Math.floor(leftSeconds.value / 60);
  // 秒
  const sece = leftSeconds.value % 60;

  min.value = mine > 9 ? mine : "0" + mine;
  sec.value = sece > 9 ? sece : "0" + sece;
  leftSeconds.value -= 1;
}
function time() {
  setInterval(() => {
    emit("timeout", leftSeconds.value);
    countdown();
  }, 1000);
}
</script>
