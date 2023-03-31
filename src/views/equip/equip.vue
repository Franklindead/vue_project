<template>
    <div class="image-text-container">
      <div class="image-container">
        <img :src="imageSrc" alt="image" />
      </div>
      <div class="text-container">
        <h2>{{ title }}</h2>
        <p>{{ text }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, onMounted } from "vue";
  
  interface Props {
    imageSrc: string;
    title: string;
    text: string;
  }
  
  const imageSrc = ref("");
  const title = ref("");
  const text = ref("");
  
  onMounted(() => {
    // 通过props传递数据并更新响应式变量
    imageSrc.value = props.imageSrc;
    title.value = props.title;
    text.value = props.text;
  
    // 监听窗口大小变化，更新图片和文本的高度
    const resizeHandler = () => {
      const imageContainer = document.querySelector(".image-container") as HTMLElement;
      const textContainer = document.querySelector(".text-container") as HTMLElement;
      textContainer.style.maxHeight = `${imageContainer.offsetHeight}px`;
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
  });
  
  // 定义props
  const props = defineProps<Props>();
  
  </script>
  
  <style lang="less" scoped>
  .image-text-container {
    display: flex;
    margin: 1rem 2rem;
    
  
    .image-container {
      width: 30%;
      margin-right: 1rem;
  
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8%;
      }
    }
  
    .text-container {
      width: 68%;
      max-height: 100%;
  
      h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
  
      p {
        font-size: 1rem;
        line-height: 1.5;
      }
    }
  }
  </style>
  