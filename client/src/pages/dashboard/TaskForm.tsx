import { motion } from "framer-motion";
import CustomInputField from "../../components/inputs/CustomInputField";
import { lottie } from "../../constants";
import CustomButton from "../../components/button/CustomButton";
import DatePicker from "../../components/datePicker/DatePicker";
import { useTaskStore } from "../../store/task.store";
import { createTask } from "../../api/task";
import { useState } from "react";
import dayjs from "dayjs";
import { useAuthStore } from "../../store/auth.store";

const TaskForm = () => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { addTask } = useTaskStore();
  const handleAddTask = async () => {
    setLoading(true);
    try {
      const res = await createTask(newTask);
      addTask(res.data.task);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
      });
      if (user) {
        let newUser = user;
        newUser.taskSummary.totalTasks = user.taskSummary.totalTasks + 1;
        updateUser(newUser.taskSummary);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="lg:col-span-3 h-fit neumorphic-flat-sm rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <CustomInputField
          type="text"
          placeholder="Task title"
          icon={lottie.category}
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <CustomInputField
          type="textarea"
          placeholder="Task description"
          rows={4}
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <DatePicker
          value={newTask.dueDate}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              dueDate: e.toISOString(),
            })
          }
          minDate={dayjs()}
        />
        <CustomButton
          moreStyle="text-[0.9rem] mt-6"
          onClick={handleAddTask}
          isDisabled={loading}
          text="Add Task"
          icon={lottie.upload}
        />
      </form>
    </div>
  );
};

export default TaskForm;
