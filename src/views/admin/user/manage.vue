<template>
  <div class="container">
    <data-table ref="pagingTable" :options="options" :list-query="listQuery">
      <template #filter-content>
        <el-row>
          <el-col :span="24">
            <el-input
              v-model="listQuery.params.username"
              placeholder="用户名"
              style="width: 200px"
              class="filter-item"
            />
          </el-col>
        </el-row>
      </template>

      <template #data-columns>
        <el-table-column label="用户名" align="center">
          <template #default="{ row }">
            {{ row.userName }}
          </template>
        </el-table-column>
        <el-table-column
          label="用户简介"
          align="center"
          prop="Introduction"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="账号" align="center" prop="account">
        </el-table-column>
        <el-table-column label="成绩" align="center" prop="score">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.state"
              size="large"
              width="60"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              inline-prompt
              active-text="正常"
              inactive-text="冻结"
              @click="handleEdit(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" @click="handleDetail(row)"
              >查看详情</el-button
            >
            <el-popconfirm
              title="次操作将永久删除该用户，确定继续吗？"
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
          <el-form label-width="100px" :model="userForm">
            <el-form-item label="用户名">
              {{ userForm.userName }}
            </el-form-item>
            <el-form-item label="用户简介">
              {{ userForm.Introduction }}
            </el-form-item>
            <el-form-item label="账号">
              {{ userForm.account }}
            </el-form-item>
            <el-form-item label="成绩">
              {{ userForm.score }}
            </el-form-item>
            <el-form-item label="邮箱">
              {{ userForm.email ? userForm.email : "空" }}
            </el-form-item>
            <el-form-item label="电话">
              {{ userForm.phone ? userForm.phone : "空" }}
            </el-form-item>
            <el-form-item label="学号">
              {{ userForm.student_number ? userForm.student_number : "空" }}
            </el-form-item>
            <el-form-item label="创建日期">
              {{ userForm.create_time }}
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="userManage">
import { ref, reactive } from "vue";
import DataTable from "@/components/public/DataTable.vue";
import { deleteData, saveData } from "@/api/common";
import { ElMessage } from "element-plus";

const drawer = ref(false);

const userForm = ref({});

const listQuery = reactive({
  current: 1,
  size: 10,
  params: {
    username: "",
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
  listUrl: "/home/getAllUser",
  // 删除请求URL
  deleteUrl: "/exam/deleteRecord",
});

const handleEdit = (row: any) => {
  //   row.state = row.state ? 1 : 0;
  saveData("/home/updateUserState", row).then((res) => {
    ElMessage.success("修改成功");
  });
};

const handleDetail = (row: any) => {
  drawer.value = true;
  userForm.value = row;
};

const handleDelete = (row: any) => {
  deleteData("/user/deleteUser", row).then((res) => {
    ElMessage.success("删除成功");
  });
};
</script>

<style lang="less" scoped></style>
