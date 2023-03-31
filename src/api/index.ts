import { IRegisterForm } from "../models/user";
import request from "../utils/request";

export const getUsername = (account: string) =>
  request({
    url: `/user/userName?account=${account}`,
    method: "get",
  });
// 注册
export const getRegister = (data: IRegisterForm) =>
  request({
    url: `/user/register`,
    method: "post",
    data: data,
  });
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
