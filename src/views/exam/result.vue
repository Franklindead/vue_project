<template>
  <div class="container">
    <h2 class="text-center" style="text-align: center">
      {{ paperData.title }}
    </h2>
    <p class="text-center" style="color: #666">{{ paperData.createTime }}</p>

    <el-row :gutter="24" style="margin-top: 50px; text-align: center">
      <el-col :span="8" class="text-center">
        考生姓名：{{ paperData.userName }}
      </el-col>

      <el-col :span="8" class="text-center">
        考试用时：{{ paperData.userTime }}分钟
      </el-col>

      <el-col :span="8" class="text-center">
        考试得分：{{ paperData.userScore }}
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <div
        v-for="(item, index) in paperData.answer"
        :key="item.id"
        class="qu-content"
      >
        <p>
          {{ index + 1 }}.{{ item.question_content }}（得分：{{ item.score }}）
        </p>
        <div v-if="item.quType === 1 || item.quType === 3">
          <el-radio-group v-model="item.index">
            <el-radio v-for="(an, index) in item.count" :label="index">
              {{ String.fromCharCode(65 + index) }}.{{
                item?.["option" + String.fromCharCode(65 + index)]
              }}
            </el-radio>
          </el-radio-group>

          <el-row :gutter="24">
            <el-col :span="12" style="color: #24da70">
              正确答案：{{ item.answer }}
            </el-col>

            <el-col
              v-if="!item.answered"
              :span="12"
              style="text-align: right; color: #ff0000"
            >
              我的回答：未答
            </el-col>

            <el-col
              v-if="item.answered && !item.score"
              :span="12"
              style="text-align: right; color: #ff0000"
            >
              我的回答：{{ item.userAnswer }}
            </el-col>

            <el-col
              v-if="item.answered && item.score"
              :span="12"
              style="text-align: right; color: #24da70"
            >
              我的回答：{{ item.userAnswer }}
            </el-col>
          </el-row>
        </div>

        <div v-if="item.quType === 4">
          <el-row :gutter="24">
            <el-col :span="12"> 我的回答：{{ item.userAnswer }} </el-col>
          </el-row>
        </div>

        <div v-if="item.quType === 2">
          <el-checkbox-group v-model="item.index">
            <el-checkbox
              v-for="(an, index) in item.count"
              :key="index"
              :label="index"
              >{{ String.fromCharCode(65 + index) }}.{{
                item?.["option" + String.fromCharCode(65 + index)]
              }}
            </el-checkbox>
          </el-checkbox-group>

          <el-row :gutter="24">
            <el-col :span="12" style="color: #24da70">
              正确答案：{{ item.answer }}
            </el-col>

            <el-col
              v-if="!item.answered"
              :span="12"
              style="text-align: right; color: #ff0000"
            >
              我的回答：未答
            </el-col>

            <el-col
              v-if="item.answered && !item.score"
              :span="12"
              style="text-align: right; color: #ff0000"
            >
              我的回答：{{ item.userAnswer }}
            </el-col>

            <el-col
              v-if="item.answered && item.score"
              :span="12"
              style="text-align: right; color: #24da70"
            >
              我的回答：{{ item.userAnswer }}
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { getPaperInfo } from "@/api/paper/exam";
import { useRoute } from "vue-router";

const paperId: any = ref("");
const paperData: any = ref("");
// 定义路由
const route = useRoute();

onMounted(() => {
  paperId.value = route.params.paperId;
  console.log(paperId.value);

  getPaperInfo({ paperId: paperId.value }).then((res: any) => {
    paperData.value = res.data;
    res.data.answer.forEach((item: any) => {
      if (item.quType === 1 || item.quType === 3) {
        item.index = Number(item.answer.charCodeAt() - 65);
      } else if (item.quType === 2) {
        let str: any = [];
        item.answer.split("").forEach((v: any) => {
          str.push(Number(v.charCodeAt() - 65));
        });
        item.index = str;
      }
      if (item.userAnswer) {
        item.answered = true;
      }
      item.count = 0;
      for (let key in item) {
        // 判断是否包含option并且值不为null
        if (key.includes("option") && item[key] !== null) {
          item.count++;
        }
      }
    });
    paperData.value.userName = localStorage.getItem("ms_username");
    // 将秒数转换为分钟
    paperData.value.userTime = Math.ceil(paperData.value.user_time / 60);
    paperData.value.userScore = res.data.user_score;
  });
});
</script>

<style lang="less" scoped>
.qu-content {
  //   border-bottom: #eee 1px solid;
  padding-bottom: 10px;
  div {
    line-height: 30px;
  }
}
.el-checkbox-group label,
.el-radio-group label {
  width: 100%;
}
.card-title {
  //   background: #eee;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
}
.card-line {
  padding-left: 10px;
  span {
    cursor: pointer;
    margin: 2px;
  }
}
</style>
