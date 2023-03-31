import { post } from "@/utils/request";

// 获取消息列表
export function getMessageList() {
  return post("/home/message");
}

// 删除消息
export function deleteMessage(data: any) {
  return post("/home/deleteMessage", data);
}

// 获取不及格用户信息
export function getFailUserList() {
  return post("/home/getFailUser");
}

// 获取近期考试成绩
export function getRecentScore(data: any) {
  return post("/home/getRecentExam", data);
}

// 获取章节完成情况
export function getChapterList(data: any) {
  return post("/home/getChapter", data);
}
const headers = {
  "Content-Type": "multipart/form-data",
};
// 修改用户头像
export function updateAvatar(formData: FormData) {
  return post("/home/uploadAvatar", formData, headers);
}
