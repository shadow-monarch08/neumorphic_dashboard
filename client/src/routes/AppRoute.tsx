import React from "react";
import { Route, Routes } from "react-router";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import AvatarSelect from "../pages/avatarSelect";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const AppRoute = () => {
  return (
    <Routes>
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="selectAvatar" element={<AvatarSelect />} />
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
