import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CustomInputField from "../../components/inputs/CustomInputField";
import { lottie } from "../../constants";
import { deleteTaskDatabase, fetchSortedTask } from "../../api/task";
import { useTaskStore } from "../../store/task.store";
import { useAuthStore } from "../../store/auth.store";
import type {
  FetchTaskPayload,
  SortedTaskPayload,
  Task,
} from "../../types/tasks";

const TaskTable: React.FC = ({}) => {
  // Pagination
  const { initiateTask, tasks, deleteTask } = useTaskStore();
  const { user, updateUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [paginationDetail, setPaginationDetail] = useState({
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Sorting
  const [sortField, setSortField] = useState<keyof Task>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = async (field: keyof Task) => {
    if (user) {
      let payload: SortedTaskPayload = {
        userId: user._id,
        page: page,
        limit: rowsPerPage,
        sortField: field,
        sortOrder: "asc",
      };
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        if (sortOrder === "asc") {
          payload.sortOrder = "desc";
        } else {
          payload.sortOrder = "asc";
        }
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
      const res = await fetchSortedTask(payload);

      initiateTask(res.data);
      setPaginationDetail({
        totalPages: res.pagination.totalPages,
        hasNextPage: res.pagination.hasNextPage,
        hasPrevPage: res.pagination.hasPrevPage,
      });
    }
  };

  const handleDelete = async (id: string) => {
    deleteTask(id);
    await deleteTaskDatabase({ taskId: id });
    if (user) {
      let newUser = user;
      newUser.taskSummary.totalTasks = user.taskSummary.totalTasks - 1;
      updateUser(newUser.taskSummary);
    }
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const payload: SortedTaskPayload = {
          userId: user._id,
          page: page,
          limit: rowsPerPage,
          sortField: sortField,
          sortOrder: sortOrder,
        };
        const res = await fetchSortedTask(payload);

        initiateTask(res.data);
        setPaginationDetail({
          totalPages: res.pagination.totalPages,
          hasNextPage: res.pagination.hasNextPage,
          hasPrevPage: res.pagination.hasPrevPage,
        });
      }
    })();
  }, [user, page]);

  return (
    <div className="lg:col-span-7 neumorphic-flat-sm rounded-xl p-6 overflow-x-auto">
      {/* Controls */}
      <div className="flex justify-between items-center mb-4 w-1/3">
        <CustomInputField
          placeholder="Search tasks..."
          icon={lottie.search}
          onChange={() => {}}
        />
      </div>
      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th
                className="py-3 px-4 cursor-pointer hover:text-secondary-200"
                onClick={() => handleSort("title")}
              >
                Title{" "}
                {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-secondary-200"
                onClick={() => handleSort("description")}
              >
                Description{" "}
                {sortField === "description" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-secondary-200"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-secondary-200"
                onClick={() => handleSort("createdAt")}
              >
                Created At{" "}
                {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-secondary-200"
                onClick={() => handleSort("dueDate")}
              >
                Due Date{" "}
                {sortField === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(tasks ?? []).map(([key, value]) => (
              <tr key={key} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium">{value.title}</td>
                <td className="py-3 px-4">{value.description}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {}}
                    className={`px-3 py-1 text-xs rounded-full ${
                      value.status === "completed"
                        ? "bg-secondary text-secondary-200"
                        : "bg-tertiary text-tertiary-100"
                    }`}
                  >
                    {value.status}
                  </button>
                </td>
                <td className="py-3 px-4">
                  {new Date(value.createdAt).toLocaleDateString()}{" "}
                  {new Date(value.createdAt).toLocaleTimeString()}
                </td>
                <td className="py-3 px-4">
                  {new Date(value.dueDate).toLocaleDateString()}{" "}
                  {new Date(value.dueDate).toLocaleTimeString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(key)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tasks?.size === 0 && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  No tasks found. Try adding one!
                </td>
              </motion.tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {paginationDetail.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!paginationDetail.hasPrevPage}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: paginationDetail.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? "bg-secondary-200 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((p) => Math.min(paginationDetail.totalPages, p + 1))
              }
              disabled={!paginationDetail.hasNextPage}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;
