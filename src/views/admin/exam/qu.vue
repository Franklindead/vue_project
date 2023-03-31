<template>
  <!-- 试题管理 -->
  <div class="container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      @addData="addData"
      @searchChange="pageChange"
    >
      <template #filter-content>
        <el-row>
          <el-col :span="24">
            <el-select
              v-model="listQuery.params.quType"
              class="filter-item"
              clearable
            >
              <el-option
                v-for="item in quTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-model="listQuery.params.content"
              placeholder="题目内容"
              style="width: 200px"
              class="filter-item"
            />
          </el-col>
        </el-row>
      </template>

      <template #data-columns>
        <el-table-column label="题目类型" align="center" width="100px">
          <template #default="scope">
            {{
              scope.row.quType === 1
                ? "单选题"
                : scope.row.quType === 2
                ? "多选题"
                : "判断题"
            }}
          </template>
        </el-table-column>

        <el-table-column
          label="题目内容"
          prop="question_content"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column label="操作" align="center" width="180px">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-drawer
      v-model="drawer"
      size="50%"
      :destroy-on-close="true"
      :show-close="true"
    >
      <el-form :model="testForm" ref="form" label-width="80px" :inline="false">
        <el-form-item label="题目类型" prop="quType">
          <el-select
            v-model="testForm.quType"
            :disabled="quTypeDisabled"
            class="filter-item"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in quTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="题目内容" prop="content">
          <el-input v-model="testForm.content" />
        </el-form-item>
        <el-table :data="testForm.options" border stripe>
          <el-table-column label="是否答案" width="100" align="center">
            <template #default="scope">
              <el-checkbox v-model="scope.row.isRight">答案</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="答案内容">
            <template v-slot="scope">
              <el-input v-model="scope.row.content" type="textarea" />
            </template>
          </el-table-column>
        </el-table>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            style="margin-left: 90%; margin-top: 20px"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="QuList">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import DataTable from "@/components/public/DataTable.vue";
import test from "node:test";
import { deleteData, saveData } from "@/api/common";

const drawer = ref(false);

const quTypeDisabled = ref(false);

const testForm = reactive({
  quType: "",
  content: "",
  options: [],
  answer: "",
});

const listQuery = reactive({
  current: 1,
  size: 10,
  params: {
    content: "",
    quType: "",
    repoIds: [],
  },
});

const quTypes = reactive([
  {
    value: 1,
    label: "单选题",
  },
  {
    value: 2,
    label: "多选题",
  },
  {
    value: 3,
    label: "判断题",
  },
]);

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
  listUrl: "/exam/getRecordList",
  // 删除请求URL
  deleteUrl: "/exam/deleteRecord",
  // 添加数据路由
  addRoute: "AddQu",
});

const pageChange = (page: number) => {
  listQuery.current = page;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm("此操作将永久删除该题目, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteData("/exam/deleteRecord", row)
        .then(() => {
          ElMessage.success("删除成功");
          pagingTable.value.getList();
        })
        .catch(() => {});
    })
    .catch(() => {});
};

const addData = () => {
  drawer.value = true;
  quTypeDisabled.value = false;
  testForm.quType = "";
  testForm.content = "";
  testForm.options = [];
};

const pagingTable = ref<any>();

// drawer框
const handleEdit = (row: any) => {
  type.value = "edit";
  testForm.options = [];
  drawer.value = true;
  quTypeDisabled.value = true;
  testForm.content = row.question_content;
  testForm.quType = row.quType;
  testForm.answer = row.answer;
  if (row.quType === 1) {
    testForm.options.push({
      isRight: row.answer === "A" ? true : false,
      content: `${row.optionA}`,
    });
    testForm.options.push({
      isRight: row.answer === "B" ? true : false,
      content: `${row.optionB}`,
    });
    testForm.options.push({
      isRight: row.answer === "C" ? true : false,
      content: `${row.optionC}`,
    });
    testForm.options.push({
      isRight: row.answer === "D" ? true : false,
      content: `${row.optionD}`,
    });
  } else if (row.quType === 2) {
    testForm.options.push({
      isRight: row.answer === "A" ? true : false,
      content: `${row.optionA}`,
    });
    testForm.options.push({
      isRight: row.answer === "B" ? true : false,
      content: `${row.optionB}`,
    });
    testForm.options.push({
      isRight: row.answer === "C" ? true : false,
      content: `${row.optionC}`,
    });
    testForm.options.push({
      isRight: row.answer === "D" ? true : false,
      content: `${row.optionD}`,
    });
    testForm.options.push({
      isRight: row.answer === "E" ? true : false,
      content: `${row.optionE}`,
    });
  } else {
    testForm.options.push({
      isRight: row.answer === "A" ? true : false,
      content: "正确",
    });
    testForm.options.push({
      isRight: row.answer === "B" ? true : false,
      content: "错误",
    });
  }
};

const handleTypeChange = (value: any) => {
  testForm.options = [];
  if (value === 1) {
    testForm.options.push({ isRight: false, content: "" });
    testForm.options.push({ isRight: false, content: "" });
    testForm.options.push({ isRight: false, content: "" });
    testForm.options.push({ isRight: false, content: "" });
  } else if (value === 2) {
    testForm.options.push({ isRight: false, content: "" });
    testForm.options.push({ isRight: false, content: "" });
    testForm.options.push({ isRight: false, content: "" });
    testForm.options.push({ isRight: false, content: "" });
    testForm.options.push({ isRight: false, content: "" });
  } else {
    testForm.options.push({ isRight: true, content: "正确" });
    testForm.options.push({ isRight: false, content: "错误" });
  }
};

const type = ref("add");

const onSubmit = async () => {
  if (testForm.quType === "") {
    ElMessage.error("请选择题目类型");
    return;
  }
  if (testForm.content === "") {
    ElMessage.error("请输入题目内容");
    return;
  }
  if (testForm.options.length === 0) {
    ElMessage.error("请输入题目选项");
    return;
  }
  let count = 0;
  testForm.options.forEach((item: any) => {
    if (item.isRight) {
      count++;
    }
  });

  if (!count) {
    ElMessage.error("请选择正确答案");
    return;
  } else {
    if (count === 1) {
      for (let i = 0; i < testForm.options.length; i++) {
        if (testForm.options[i].isRight) {
          testForm.answer = String.fromCharCode(65 + i);
        }
      }
    } else {
      let answer = "";
      for (let i = 0; i < testForm.options.length; i++) {
        if (testForm.options[i].isRight) {
          answer += String.fromCharCode(65 + i);
        }
      }
      testForm.answer = answer;
    }

    if ((testForm.quType === 1 || testForm.quType === 3) && count > 1) {
      ElMessage.error("单选题只能有一个正确答案");
      return;
    } else {
      let res = null;
      if (type.value == "add") {
        res = await saveData("/exam/addRecord", testForm);
      } else {
        res = await saveData("/exam/updateRecord", testForm);
      }
      if (res.code === 200 && type.value == "add") {
        ElMessage.success("添加成功");
        drawer.value = false;
        pagingTable.value.getList();
      } else {
        ElMessage.success("修改成功");
        drawer.value = false;
        pagingTable.value.getList();
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
