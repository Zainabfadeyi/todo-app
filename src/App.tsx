// App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Auth/register";
import Login from "./components/Auth/login";
import Home from "./components/Auth/home";
import Dashboard from "./pages/Dashboard";
import MyListPage from "./pages/MyListPage";
import Today from "./pages/Today";
import Sidebar from "./components/sidenavbar/Sidebar";
import ListDetailPage from "./pages/ListDetailPage";
import Layout from "./components/Layout/Layout";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="today" element={<Today />} />
            <Route path="list" element={<MyListPage />} />
            <Route path="list/:id/:name" element={<ListDetailPage />} />
          </Route>

          {/* Add additional routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
