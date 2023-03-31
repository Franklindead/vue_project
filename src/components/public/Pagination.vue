<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :pager-count="pagerCount"
      :total="total"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const emits = defineEmits(["pagChange", "update:page", "update:size"]);

//计算属性-currentPage
const currentPage = computed({
  get() {
    return props.page;
  },
  set(val) {
    emits("update:page", val);
  },
});
// const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

//计算属性-pageSize
const pageSize = computed({
  get() {
    return props.size;
  },
  set(val) {
    emits("update:size", val);
  },
});

//组件传参
const props = defineProps({
  //当前页数
  page: {
    type: Number,
    default: 1,
  },
  //每页条数
  size: {
    type: Number,
    default: 10,
  },
  //是否为分页按钮添加背景色
  background: {
    type: Boolean,
    default: false,
  },
  //组件布局，子组件名用逗号分隔
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  //设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
  pagerCount: {
    type: Number,
    default: 7,
  },
  //总条目数
  total: {
    type: Number,
    required: true,
  },
  //是否自动滚动到顶部
  autoScroll: {
    type: Boolean,
    default: true,
  },
  //每页显示个数选择器的选项设置
  pageSizes: {
    type: Array,
    default: () => [6, 10, 14, 18],
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

//每页显示条数改变
const handleSizeChange = (val: Number) => {
  emits("pagChange", { page: currentPage.value, size: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};

//页数改变
const handleCurrentChange = (val: Number) => {
  emits("pagChange", { page: val, size: pageSize.value });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};
</script>

<style lang="less" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>

<!--分页参数详解page:当前页；size:每页条数；total:总条数；pagChange：分页条件改变触发查询表格数据的方法-->
<!-- <page-component
  v-model:page="ipagination.currentPage"
  v-model:size="ipagination.pageSize"
  layout="total, prev, pager, next, jumper"
  :total="ipagination.total"
  @pagChange="loadData"
/> -->
