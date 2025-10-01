export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "expired";
  dueDate: string;
  user: string;
  createdAt: string;
}

export interface FetchTaskPayload {
  page: number;
  limit: number;
  userId: string;
}

export interface SortedTaskPayload extends FetchTaskPayload {
  sortField: string;
  sortOrder: "asc" | "desc";
}

export interface GetTaskByMonthPayload {
  month: number;
  year: number;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface FetchTaskResponse extends BaseResponse {
  data: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateTaskResponse extends BaseResponse {
  data: {
    task: Task;
  };
}

export interface GetTaskByMonthResponse extends BaseResponse {
  data: {
    tasks: Task[];
    filter: {
      month: number;
      year: number;
    };
  };
}
