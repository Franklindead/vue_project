import { IRegisterForm } from "../models/user";
import request, { post } from "../utils/request";

export const getUsername = (account: string) =>
  request({
    url: `/user/userName?account=${account}`,
    method: "get",
  });
// 注册
export const getRegister = (data: IRegisterForm) =>
  post("/user/register", data);
// 邮箱验证码
export const sendEmailCode = (email: string) =>
  request({
    url: `/user/forget?email=${email}`,
    method: "get",
  });

export const login = (account: string, pwd: string) =>
  request({
    url: `/user/login?account=${account}&password=${pwd}`,
    method: "get",
  });

// 修改密码
export const updatePassword = (account: string, pwd: string) =>
  request({
    url: `/user/updatePassword?account=${account}&password=${pwd}`,
    method: "post",
  });

// 获取用户信息
export const getUserInfo = (account: string) =>
  request({
    url: `/user/userInfo?account=${account}`,
    method: "get",
  });