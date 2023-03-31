<template>
  <div class="container">
    <h1>平台简介</h1>
    <div class="introduction">
      <h2>功能描述</h2>
      <p>
        1. 该系统主要用于帮助同学们了解和学习计算机实验室安全知识,用户完成
        <span class="blue"> 章节学习</span>
        的任务点，想要完成任务点，就需要观看章节视频，以及完成章节当中的练习题，完成任务点后可以增加用户的平时分,
        <span class="blue"> 实验室</span>
        当中可以查看实验室中的所有设备，以及实验室的各项规章制度，同时还可以查看实验室内的各种安全标识，学习警示标志有助于同学们避免不必要的危险
      </p>
      <p>
        2. 了解实验室相关的
        <span class="blue"> 安全法规</span>
        可以帮助同学们有效的提高自我保护能力
      </p>
      <p>
        3. 平台给每个用户的初始分数是
        <span class="success">80分 </span
        >，平台会对同学们的考试成绩以及举报行为进行相应的打分，当分数低于
        <span class="warning">60分 </span
        >后会平台发出警告,更低者会限制平台功能使用和实验室进出，以及最后的几名，会在首页当中进行集体展示
      </p>
      <p>
        4.
        平台管理员会不定时的发出任务到公告栏，在规定时间完成相应的任务能增加分数，反之会扣除相应的分数，成绩落后者会在平台中进行轮流展示
      </p>
      <p>
        5. 用户可以在平台中预约实验室，但预约功能只对用户平时分高于
        <span class="warning">60分</span>
        的用户开放，每人每天只能预约一次，总共只能预约三次
      </p>
      <p>
        6.
        用户在测试与考核中可以进行所学知识点测试，用户可以选择测试练习或者在线考试，测试练习可以进行多次，但是在线考试只能进行一次，在线考试会由管理员从后台发出，用可以更加题库自行选择，测试练习不会限制时间，但在线考试会限制考试时间段，用户必须在规定的日期时间内完成考试，
        否则将被认定为弃考，弃考者会被扣除相应的分数，考试成绩会在考试结束后公布，用户也可以在考试记录当中查看
      </p>
      <p>
        7.
        如果用户有什么需要向后台进行反馈，或者有好的建议，可以到留言/举报功能中进行留言，然后提交到系统当中，当用户发现有人有违规操作行为时，用户也可以对该同学进行举报操作，举报会发送到后台由管理员处理，处理完成后会给予相应的回复
      </p>
      <h2>平台构建</h2>
      Vue
      <el-progress :percentage="79.4" color="#42b983"></el-progress>
      TypeScript
      <el-progress :percentage="14" color="#f1e05a"></el-progress>
      CSS
      <el-progress :percentage="5.6"></el-progress>
      HTML
      <el-progress :percentage="1" color="#f56c6c"></el-progress>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
</script>

<style lang="less" scoped>
.container {
  padding: 0 120px;
  h1 {
    display: flex;
    padding: 1.5rem 0;
    font-size: 3rem;
    justify-content: center;
    text-shadow: 5px 5px 0 rgba(76, 40, 187, 0.4);
  }
  .introduction {
    span {
      font-size: 22px;
    }
    p {
      font-size: 19px;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.541);
    }
    .success {
      color: #67c23a;
    }
    .blue {
      color: #409eff;
    }
    .warning {
      color: #e6a23c;
    }
  }
}
</style>
