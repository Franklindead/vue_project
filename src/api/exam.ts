// Description: 试卷相关接口
//导入request
import request from "../utils/request";

//获取试卷详情
export const fetchDetail = (params: any) =>
  request({
    url: "/exam/getExamById",
    method: "post",
    data: params,
  });

// 获取本人的所有考试记录
export const fetchExamRecord = (params: any) =>
  request({
    url: "/exam/getExamRecord",
    method: "post",
    data: params,
  });
