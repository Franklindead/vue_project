<template>
  <div class="container">
    <h1>设备展示</h1>
    <Equip
      v-loading="equipList.length === 0"
      v-for="(item, index) in equipList"
      :key="item.id"
      :image-src="item.imgUrl"
      :title="item.equipName"
      :text="item.detail"
    ></Equip>
  </div>
</template>

<script setup lang="ts">
import Equip from "./equip/equip.vue";
import { fetchAllEquip } from "@/api/equip";
import { ref, reactive, onMounted } from "vue";

const equipList = ref([]);

onMounted(() => {
  fetchAllEquip().then((res: any) => {
    equipList.value = res.data;
  });
});
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
