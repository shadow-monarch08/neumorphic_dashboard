export interface User {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  taskSummary: {
    totalTasks: number;
    completedTasks: number;
  };
  // add extras your backend returns (avatar, etc.)
  [key: string]: any;
}

export interface GetUserResponce {
  success: boolean;
  message?: string;
  data: User;
}
