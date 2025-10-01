import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import TaskTable from "./TaskTable";
import Footer from "../../components/footer/Footer";
import Calendar from "../../components/calender/Calendar";
import { useAuthStore } from "../../store/auth.store";
import TaskForm from "./TaskForm";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="min-h-screen overflow-auto w-full bg-primary">
      {/* Header */}
      <DashboardHeader userData={user} loading={false} />

      {/* Content Split 60-40 */}
      <div className="max-w-[88rem] mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-10 gap-8 mb-10">
        {/* Table */}
        <TaskTable />

        {/* Add Task Form (40%) */}
        <TaskForm />
      </div>
      <Calendar />
      <Footer />
    </div>
  );
};

export default Dashboard;
