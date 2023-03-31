<template>
  <div class="container">
    <h1>设备展示</h1>
    <!-- <Equip></Equip> -->
  </div>
</template>

<script setup lang="ts">
import Equip from "./equip/equip.vue";
import { ref, reactive } from "vue";
</script>

<style lang="less" scoped>
.container {
  h1 {
    display: flex;
    padding: 1.5rem 0;
    font-size: 3rem;
    justify-content: center;
    text-shadow: 5px 5px 0 rgba(76, 40, 187, 0.4);
  }
}
</style>
