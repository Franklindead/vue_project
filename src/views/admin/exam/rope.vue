<template>
  <!-- 题库管理 -->
  <div class="container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      @addData="addData"
    >
      <template #filter-content>
        
        <el-input
          v-model="listQuery.params.title"
          placeholder="搜索题库名称"
          style="width: 200px"
          class="filter-item"
        />
      </template>

      <template #data-columns>
        <el-table-column label="题库名称" prop="title" />

        <el-table-column label="题库类型" align="center">
          <template #default="scope">
            <span v-if="scope.row.type == 1">期末考核</span>
            <span v-else>测试练习</span>
          </template>
        </el-table-column>

        <el-table-column label="单选题数量" prop="radio_count" align="center" />

        <el-table-column label="多选题数量" prop="multi_count" align="center" />

        <el-table-column label="判断题数量" prop="judge_count" align="center" />

        <el-table-column label="创建时间" align="center" prop="create_time" />

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" @click="getDetail(scope.row.exam_id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="deleteExam(scope.row.exam_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <el-form
        :model="drawerForm"
        ref="form"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="题库名称">
          <el-input v-model="drawerForm.title" />
        </el-form-item>
        <el-form-item label="题库备注">
          <el-input v-model="drawerForm.content" />
        </el-form-item>

        <el-form-item>
          <el-button v-if="changeState" type="primary" @click="onSubmit(0)"
            >添加</el-button
          >
          <el-button v-else type="primary" @click="onSubmit(1)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="QuList">
import DataTable from "@/components/public/DataTable.vue";
import { deleteData, fetchDetail, saveData, deleteOne } from "@/api/common";
import { ref, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const listQuery = reactive({
  current: 1,
  size: 10,
  params: {
    title: "",
  },
});

const drawer = ref(false);

const changeState = ref(false);

const drawerForm = ref({
  title: "",
  content: "",
});

const options = reactive({
  // 可批量操作
  multi: true,

  // 批量操作列表
  multiActions: [
    {
      value: "delete",
      label: "删除",
    },
  ],
  // 列表请求URL
  listUrl: "exam/getAllQuestion",
  // 删除请求URL
  deleteUrl: "/exam/deleteQuestionList",
  // 添加数据路由
  addRoute: "addData",
});

const pagingTable = ref();

const addData = () => {
  drawer.value = true;
  changeState.value = true;
  drawerForm.value = {
    title: "",
    content: "",
  };
};

const getDetail = (id: any) => {
  changeState.value = false;
  drawer.value = true;
  fetchDetail("exam/getExamById", id).then((res: any) => {
    drawerForm.value = res.data;
  });
};

function deleteExam(examId: any) {
  ElMessageBox.confirm("确定删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteOne("/exam/deleteQuestion", { id: examId }).then((res: any) => {
        ElMessage.success("删除成功");
        pagingTable.value.getList();
      });
    })
    .catch(() => {});
}

const onSubmit = (type: any) => {
  if (type) {
    saveData("exam/updateExamTitle", drawerForm).then((res: any) => {
      ElMessage.success("保存成功");
      drawer.value = false;
      pagingTable.value.getList();
    });
  } else {
    saveData("exam/addExam", drawerForm.value).then((res: any) => {
      ElMessage.success("添加成功");
      drawer.value = false;
      pagingTable.value.getList();
    });
  }
};
</script>

<style lang="less" scoped></style>
