<template>
  <div class="notifications-container">
    <div :class="type">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            v-if="type === 'success'"
            class="succes-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            v-else-if="type === 'waiting'"
            class="waiting-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z"
            />
            <path
              d="M10 4a1 1 0 00-1 1v4.5l-1.5 1.5a1 1 0 101.414 1.414l2-2a1 1 0 000-1.414L8.414 6.5 10 5.914V5a1 1 0 00-1-1z"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 10 10"
                to="360 10 10"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <svg
            v-else
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            class="error-svg"
          >
            <path
              clip-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div :class="type + '-prompt-wrap'">
          <p :class="type + '-prompt-heading'">
            {{ heading }}<span class="time">{{ bookTime }}</span>
          </p>
          <div :class="type + '-prompt-prompt'">
            <p>{{ content }}</p>
            <p v-if="request">回复：{{ request }}</p>
          </div>
          <div :class="type + '-button-container'">
            <el-popconfirm
              title="确认删除?"
              confirm-button-text="确认"
              cancel-button-text="不了"
              @confirm="onDelete(props.id)"
            >
              <template #reference>
                <button type="button" :class="type + '-button-main'">
                  删除
                </button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tip">
import { defineProps, onMounted, ref, defineEmits } from "vue";

// 定义props
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  request: {
    type: String,
    required: false,
  },
});

let bookTime = ref("");

const emits = defineEmits(["delete"]);

onMounted(() => {
  const dt = new Date(props.time);
  const year = dt.getFullYear();
  const month = ("0" + (dt.getMonth() + 1)).slice(-2);
  const day = ("0" + dt.getDate()).slice(-2);
  const hours = ("0" + dt.getHours()).slice(-2);
  const minutes = ("0" + dt.getMinutes()).slice(-2);
  const seconds = ("0" + dt.getSeconds()).slice(-2);

  let time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  bookTime.value = time;
});

// 删除按钮的点击事件处理函数
const onDelete = (id: String) => {
  emits("delete", id);
};
</script>

<style lang="less" scoped>
.time {
  color: #999;
  font-size: 0.75rem;
  margin-left: 1rem;
}
.notifications-container {
  width: 460px;
  padding-bottom: 0.5rem;
  // height: auto;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flex {
  display: flex;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.report-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 100px 0;

  @media screen and (max-width: 767px) {
    max-width: 80%;
  }
}

.success {
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: rgb(240 253 244);
}

.succes-svg {
  color: rgb(74 222 128);
  width: 1.25rem;
  height: 1.25rem;
}

.success-prompt-wrap {
  margin-left: 0.75rem;
}

.success-prompt-heading {
  font-weight: bold;
  color: rgb(22 101 52);
}

.success-prompt-prompt {
  margin-top: 0.5rem;
  color: rgb(21 128 61);
}

.success-button-container {
  display: flex;
  margin-top: 0.875rem;
  margin-bottom: -0.375rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

.success-button-main {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #ecfdf5;
  color: rgb(0, 0, 0);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: bold;
  border-radius: 0.375rem;
  border: none;
}

.success-button-main:hover {
  background-color: #d1fae5;
}

.flex {
  display: flex;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.error-alert {
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: rgb(254 242 242);
}

.waiting {
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: rgb(231, 231, 231);
}
.waiting-svg {
  width: 24px;
  height: 24px;
  animation: rotate 100s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.waiting-prompt-wrap {
  margin-left: 0.75rem;
}

.waiting-prompt-heading {
  font-weight: bold;
  color: rgb(0, 0, 0);
}

.waiting-prompt-prompt {
  margin-top: 0.5rem;
  color: rgb(0, 0, 0);
}

.waiting-button-container {
  display: flex;
  margin-top: 0.875rem;
  margin-bottom: -0.375rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

.waiting-button-main {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: rgb(231, 231, 231);
  color: rgb(0, 0, 0);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: bold;
  border-radius: 0.375rem;
  border: none;
}

.waiting-button-main:hover {
  background-color: #d6d6d6;
}

.error-svg {
  color: #f87171;
  width: 1.25rem;
  height: 1.25rem;
}

.error-prompt-heading {
  color: #991b1b;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: bold;
}

.error-prompt-container {
  display: flex;
  flex-direction: column;
  margin-left: 1.25rem;
}

.error-prompt-wrap {
  margin-top: 0.5rem;
  color: #b91c1c;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.error-prompt-list {
  padding-left: 1.25rem;
  margin-top: 0.25rem;
  list-style-type: disc;
}
.error-button-container {
  display: flex;
  margin-top: 0.875rem;
  margin-bottom: -0.375rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  text-align: right;
}

.error-button-main {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: rgb(254 242 242);
  color: #000000;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: bold;
  border-radius: 0.375rem;
  border: none;
}

.error-button-main:hover {
  background-color: #f8c7c7;
}
</style>
