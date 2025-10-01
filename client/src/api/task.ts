import type {
  BaseResponse,
  CreateTaskResponse,
  FetchTaskPayload,
  FetchTaskResponse,
  GetTaskByMonthPayload,
  GetTaskByMonthResponse,
  SortedTaskPayload,
  Task,
} from "../types/tasks";
import client from "./client";

export const fetchTasks = async (
  payload: FetchTaskPayload
): Promise<FetchTaskResponse> => {
  const res = await client.get<FetchTaskResponse>(
    `/tasks/user/${payload.userId}`,
    {
      params: payload,
    }
  );
  return res.data;
};

export const fetchSortedTask = async (
  payload: SortedTaskPayload
): Promise<FetchTaskResponse> => {
  const res = await client.get<FetchTaskResponse>(
    `/tasks/user/${payload.userId}/sort`,
    {
      params: payload,
    }
  );
  return res.data;
};

export const fetchTaskByMonth = async (
  payload: GetTaskByMonthPayload
): Promise<GetTaskByMonthResponse> => {
  const res = await client.get<GetTaskByMonthResponse>(`/tasks/month`, {
    params: payload,
  });
  return res.data;
};

export const createTask = async (
  payload: Partial<Task>
): Promise<CreateTaskResponse> => {
  const res = await client.post<CreateTaskResponse>(`/tasks`, payload);
  return res.data;
};

export const deleteTaskDatabase = async (payload: {
  taskId: string;
}): Promise<BaseResponse> => {
  const res = await client.delete<BaseResponse>(`/tasks/${payload.taskId}`);
  return res.data;
};
