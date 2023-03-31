<template>
  <div class="container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      @addData="addData"
    >
      <template #filter-content>
        <el-row>
          <el-col :span="24">
            <el-select
              v-model="listQuery.params.level"
              placeholder="选择年级"
              clearable
            >
              <el-option
                v-for="item in grade"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="listQuery.params.name"
              placeholder="标题"
              style="width: 200px"
              class="filter-item"
            />
          </el-col>
        </el-row>
      </template>
      <template #data-columns>
        <el-table-column label="标题" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="描述" prop="description" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.level == '大一'" type="success">{{
              row.level
            }}</el-tag>
            <el-tag
              v-else-if="row.level == '大二'"
              type="success"
              effect="dark"
              >{{ row.level }}</el-tag
            >
            <el-tag v-else-if="row.level == '大三'" type="danger">{{
              row.level
            }}</el-tag>
            <el-tag
              v-else-if="row.level == '大四'"
              type="danger"
              effect="dark"
              >{{ row.level }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm
              title="次操作将永久删除该主章节，确定继续吗？"
              width="250"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-drawer v-model="drawer" title="用户详情" direction="ltr">
      <el-row>
        <el-col :span="24">
          <el-form
            ref="chapterFormRef"
            label-width="100px"
            :model="chapterForm"
            :rlues="rules"
          >
            <el-form-item label="标题">
              <el-input
                v-model="chapterForm.name"
                placeholder="标题"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="chapterForm.description"
                placeholder="描述"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="年级">
              <el-select v-model="chapterForm.level" placeholder="选择年级">
                <el-option
                  v-for="item in grade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveChapter">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="chapterManager">
import { ref, reactive } from "vue";
import DataTable from "@/components/public/DataTable.vue";
import { deleteOne, saveData } from "@/api/common";
import { ElMessage } from "element-plus";

const chapterForm = ref({});

const rules = reactive({
  name: [{ required: true, message: "请输入标题", trigger: "blur" }],
  level: [{ required: true, message: "请输入年级", trigger: "blur" }],
});

const drawer = ref(false);

const chapterFormRef = ref();

const grade = [
  {
    value: "大一",
    label: "大一",
  },
  {
    value: "大二",
    label: "大二",
  },
  {
    value: "大三",
    label: "大三",
  },
  {
    value: "大四",
    label: "大四",
  },
];

const listQuery = reactive({
  current: 1,
  size: 10,
  level: "",
  params: {
    level: "",
    name: "",
  },
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
  listUrl: "/chapter/getMainChapterList",
  // 删除请求URL
  deleteUrl: "/chapter/deleteMainChapter",
  // 添加数据路由
  addRoute: "AddQu",
});

const pagingTable = ref();

const handleEdit = (row: any) => {
  chapterForm.value = {};
  drawer.value = true;
  Object.assign(chapterForm.value, row);
};

const saveChapter = () => {
  if (chapterForm.value.id) {
    // 编辑
    saveData("/chapter/updateMainChapter", chapterForm.value).then(
      (res: any) => {
        if (res.code === 200) {
          drawer.value = false;
          ElMessage.success("编辑成功");
          pagingTable.value.getList();
        }
      }
    );
  } else {
    // 新增
    saveData("/chapter/addMainChapter", chapterForm.value).then((res: any) => {
      if (res.code === 200) {
        drawer.value = false;
        ElMessage.success("添加成功");
        pagingTable.value.getList();
      }
    });
  }
};

const handleDelete = (row: any) => {
  deleteOne("/chapter/deleteMainChapter", row).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success("删除成功");
      pagingTable.value.getList();
    }
  });
};

const addData = () => {
  chapterForm.value = {};
  drawer.value = true;
};
</script>

<style lang="less" scoped></style>
