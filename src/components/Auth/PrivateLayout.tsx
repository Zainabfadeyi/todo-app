import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../Auth/PrivateRoute";
import Layout from "../Layout/Layout";

interface PrivateLayoutProps {
  isAuthenticated: boolean;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ isAuthenticated }) => {
  return (
    <Routes>
      <PrivateRoute
        path="/"
        element={<Layout />}
        isAuthenticated={isAuthenticated}
      />
    </Routes>
  );
};

export default PrivateLayout;
