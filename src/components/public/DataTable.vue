<template>
  <div class="app-container">
    <div class="filter-container">
      <slot name="filter-content" />
      <el-row>
        <el-col>
          <el-button
            v-if="options.addRoute"
            type="primary"
            icon="Plus"
            @click="handleAdd"
            >添加</el-button
          >
        </el-col>
      </el-row>
    </div>

    <div class="filter-container" v-show="multiShow && options.multiActions">
      <el-select
        v-model="multiNow"
        :placeholder="selectedLabel"
        class="filter-item"
        style="width: 130px"
        @change="handleOption"
      >
        <el-option
          v-for="item in options.multiActions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList.list"
      :header-cell-style="{
        background: '#f2f3f4',
        color: '#555',
        'font-weight': 'bold',
        'line-height': '32px',
      }"
      border
      fit
      highlight-current-row
      @selection-change="handleSelection"
    >
      <el-table-column
        v-if="options.multi"
        align="center"
        type="selection"
        width="45"
      />
      <slot name="data-columns" />
    </el-table>
    <Pagination
      v-show="dataList.total > 0"
      :total="dataList.total"
      :page="listQuery.current"
      :size="listQuery.size"
      :background="true"
      @pagChange="PaginationChange"
    />
    <!-- <el-pagination
      v-model:current-page="listQuery.current"
      v-model:page-size="listQuery.size"
      :page-sizes="[8, 10, 12, 14]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataList.total"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, watch, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchList, deleteData, changeState } from "@/api/common.ts";
import Pagination from "./Pagination.vue";
// 使用了 <script setup> 的组件是默认私有的：一个父组件无法访问到一个使用了 <script setup> 的子组件中的任何东西，除非子组件在其中通过 defineExpose 宏显式暴露
defineExpose({
  getList: () => getList(),
  handleFilter: () => handleFilter(),
});
const route = useRoute();
const router = useRouter();
const emit = defineEmits([
  "select-changed",
  "multi-actions",
  "addData",
  "searchChange",
]);
// 定义props类型
const props = defineProps({
  options: {
    type: Object,
    default: () => {
      return {
        // 批量操作
        multiActions: [],
        // 列表请求URL
        listUrl: "/api/exam/list",
        //删除请求URL
        deleteUrl: "",
        // 启用禁用URL
        stateUrl: "",
        // 可批量操作
        multi: false,
      };
    },
  },
  // 列表查询参数
  listQuery: {
    type: Object,
    default: () => {
      return {
        current: 1,
        size: 10,
        params: {},
        t: 0,
      };
    },
  },
});

// 接口数据返回,接收一个对象
const dataList = reactive<any>({
  total: 0,
  list: [],
});
// 数据加载标识
const listLoading = ref<boolean>(false);
// 选定和批量操作
const selectedIds = ref<any[]>([]);
const selectedObjs = ref<any[]>([]);
// 显示已中多少项
const selectedLabel = ref<string>("");
// 显示批量操作
const multiShow = ref<boolean>(false);
// 批量操作的标识
const multiNow = ref<string>("");

// 监听listQuery变化时，发送请求
watch(
  () => props.listQuery,
  (newVal, oldVal) => {
    if (newVal.params !== oldVal.params) {
      handleFilter();
    }
    getList();
  },
  {
    deep: true,
  }
);
//添加数据跳转
function handleAdd() {
  emit("addData");
}
// 组件挂载前，发送请求
onMounted(() => {
  getList();
});

// 获取列表数据
async function getList() {
  listLoading.value = true;
  props.listQuery.t = new Date().getTime();
  let res = await fetchList(props.options.listUrl, props.listQuery);
  if (res.code === 200) {
    // 将res.data赋值给dataList
    dataList.total = res.data.total;
    if (res.data.list.length == 0) {
      dataList.list = [];
      listLoading.value = false;
      return;
    }
    if (res.data.list[0].create_time) {
      res.data.list.forEach((item: any) => {
        const date = new Date(item.create_time);
        const year = date.getUTCFullYear();
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        const day = `0${date.getUTCDate()}`.slice(-2);
        const hours = `0${date.getUTCHours()}`.slice(-2);
        const minutes = `0${date.getUTCMinutes()}`.slice(-2);
        const seconds = `0${date.getUTCSeconds()}`.slice(-2);
        const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        item.create_time = formattedDate;
      });
    }
    dataList.list = res.data.list;
  }
  listLoading.value = false;
}

const PaginationChange = (pagination: any) => {
  props.listQuery.current = pagination.page;
  props.listQuery.size = pagination.size;
};
// 搜索
function handleFilter() {
  // 重置页码
  props.listQuery.page = 1;
  emit("searchChange", 1);
  getList();
}
//批量操作回调
function handleOption(val: string) {
  multiNow.value = "";
  if (val === "delete") {
    handleDelete();
    return;
  }
  if (val === "enable") {
    handleState(0);
    return;
  }
  // 内部消化的操作
  if (val === "disable") {
    handleState(1);
    return;
  }
  // 向外回调的操作
  emit("multi-actions", { opt: val, ids: selectedIds.value });
}
// 修改状态，启用禁用
function handleState(state: Number) {
  // 修改状态
  changeState(props.options.stateUrl, selectedIds.value, state).then(
    (res: any) => {
      if (res.code === 0) {
        ElMessage.success("操作成功！");

        // 重新搜索
        getList();
      }
    }
  );
}

/**
 * 删除数据
 */
function handleDelete() {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请至少选择一条数据！");
    return;
  }
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 删除数据
      deleteData(props.options.deleteUrl, selectedObjs.value).then(
        (res: any) => {
          if (res.code === 200) {
            ElMessage.success("删除成功！");
            // 重新搜索
            getList();
          }
        }
      );
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
}

/**
 * 列表多选操作
 * @param val
 */
function handleSelection(val: any[]) {
  selectedIds.value = val.map((item) => item.id);
  selectedObjs.value = val;
  selectedLabel.value = `已选中${val.length}项`;
  multiShow.value = val.length > 0;
  emit("select-changed", val);
}
</script>

<style lang="less" scoped>
.filter-container {
  margin-left: 5px;
  padding-bottom: 10px;
}
.filter-item {
  margin-left: 5px;
}
.filter-container {
  margin-left: 0px;
}
.filter-item:first-child {
  margin-left: 0px;
}
</style>
