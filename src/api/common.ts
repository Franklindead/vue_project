import { post } from "../utils/request";

export function fetchList(url: string, query: Object) {
  return post(url, query);
}

export function fetchDetail(url: string, id: string) {
  return post(url, { examId: id });
}

export function saveData(url: string, data: Object) {
  return post(url, data);
}

export function deleteData(url: string, ids: Array<string>) {
  return post(url, { ids: ids });
}

export function deleteOne(url: string, data: any) {
  return post(url, data);
}

export function changeState(url: string, ids: string[], state: Number) {
  return post(url, { ids: ids, state: state });
}

const headers = {
  "Content-Type": "multipart/form-data",
};

export function uploadVideo(formData: FormData) {
  return post("/chapter/saveVideo", formData, headers);
}
