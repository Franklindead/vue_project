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
        <el-table-column
          label="所属主章节"
          prop="mainChapter"
          width="200"
          align="center"
        >
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
            label-width="100px"
            ref="chapterFormRef"
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
            <el-form-item label="视频地址">
              <div v-if="chapterForm.video_url">
                {{ chapterForm.video_url }}
              </div>
              <div v-else>
                <input type="file" ref="fileInput" @change="change" />
                <el-progress
                  :style="{ width: '80%' }"
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="percent"
                  :status="status"
                />
              </div>
            </el-form-item>
            <el-form-item label="所属主章节">
              <el-select
                v-model="chapterForm.mainChapter"
                placeholder="请选择所属主章节"
                clearable
              >
                <el-option
                  v-for="item in mainChapter"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
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
import { ref, reactive, onMounted } from "vue";
import DataTable from "@/components/public/DataTable.vue";
import { deleteOne, fetchList, saveData, uploadVideo } from "@/api/common";
import { ElMessage, ElUpload } from "element-plus";
const chapterForm = ref({});

const upload = ref<InstanceType<typeof ElUpload>>();

const chapterFormRef = ref();

const rules = reactive({
  name: [{ required: true, message: "请输入标题", trigger: "blur" }],
  mainChapter: [{ required: true, message: "请选择所属章节", trigger: "blur" }],
});

const drawer = ref(false);

const file = ref<File | null>(null);
const chunks = ref<Blob[]>([]);
const percent = ref(0);
const fileInput = ref<HTMLInputElement>();
const status = ref<"normal" | "exception" | "success">("");

const mainChapter = ref([]);

const listQuery = reactive({
  current: 1,
  size: 10,
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
  listUrl: "/chapter/getSubChapterList",
  // 删除请求URL
  deleteUrl: "/chapter/deleteSubChapter",
  // 添加数据路由
  addRoute: "AddQu",
});

const pagingTable = ref();

onMounted(() => {
  fetchList("/chapter/getMainChapterList2", {}).then((res: any) => {
    if (res.code === 200) {
      mainChapter.value = res.data;
    }
  });
});

// const change = async (e: Event) => {
//   const target = e.target as HTMLInputElement;
//   let start = 0;
//   let index = 0;
//   let chunkSize = 5 * 1024; // chunk 大块 5k

//   if (target.files) {
//     // 判空 防止 ts报错
//     const file = target.files[0];
//     const { name, size, type } = file;

//     while (start < size) {
//       // 循环
//       let blob = null; // blob 一点
//       if (start + chunkSize > size) {
//         // 比如最后一片不如 10M了
//         blob = file.slice(start, size); // 只能切到 size  file原型上提供了slice方法
//       } else {
//         blob = file.slice(start, start + chunkSize); // 从当前位置切 10M
//       }

//       start += chunkSize;
//       let blobFile = new File([blob], name);
//       let formData = new FormData(); // formData格式可直接发送xhr请求
//       formData.append("file", blobFile); // 后端就可以通过 file名获取到
//       formData.append("index", index + ""); // 每一片加了个编号
//       console.log(formData);

//       await request.post("/api/chapter/saveVideo", formData); // await 实现顺序执行 也可以实现，等待这一次结束后 下一次再开始 相当于睡眠
//       index++;
//       percent.value = (start / size) * 100; // 算出当前在百分之几的位置 为了进度条的响应式改变 可以用ui框架的进度条组件
//     } // 循环完
//     await request.get("/api/merge?dir=" + name); // 告诉后端 将我这个文件进行合并
//     percent.value = 100;
//   }
// };

const uploadChunks = async () => {
  if (!file.value) return;
  chunks.value = [];
  const chunkSize = 5 * 1024 * 1024; // 10 MB
  const totalChunks = Math.ceil(file.value.size / chunkSize);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.value.size, start + chunkSize);
    const chunk = file.value.slice(start, end);
    const blob = new Blob([chunk]);
    chunks.value.push(blob);
  }

  let uploadedChunks = 0;
  for (let i = 0; i < chunks.value.length; i++) {
    const formData = new FormData();
    formData.append("video", chunks.value[i]);
    formData.append("chunkNumber", (i + 1).toString());
    formData.append("totalChunks", chunks.value.length.toString());
    formData.append("fileName", file.value.name.split(".")[0]);
    try {
      await uploadVideo(formData);
      uploadedChunks++;
      percent.value = Math.floor((uploadedChunks / totalChunks) * 100);
    } catch (error) {
      status.value = "exception";
      console.error(error);
    }
  }
  await saveData("/chapter/merge", {
    fileName: file.value.name.split(".")[0],
    totalChunks: chunks.value.length,
  }).then((res: any) => {
    if (res.code === 200) {
      chapterForm.value.video_url = res.data.filePath;
      status.value = "success";
    }
  });
};

const change = async () => {
  file.value = (fileInput.value as HTMLInputElement).files?.[0] ?? null;
  uploadChunks();
};

// 将 base64 编码的数据转换为 Blob 对象
function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const type = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: type });
}

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
