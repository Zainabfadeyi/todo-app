// App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Register from "./components/Auth/register";
import Login from "./components/Auth/login";
import Inbox from "./pages/Inbox";
import MyListPage from "./pages/MyListPage";
import Today from "./pages/Today";
import ListDetailPage from "./pages/ListDetailPage";
import Layout from "./components/Layout/Layout";
import LayoutHome from "./components/Layout/LayoutHome";
import Home from "./components/pages/HomePage/Home";
import ForgotPassword from "./components/Auth/forgotPassword";
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import UserProfilePage from "./pages/UserProfilePage";
import Overdue from "./pages/Overdue";
import Upcoming from "./pages/Upcoming";
import Archived from "./pages/Archived";
import AuthLayout from "./components/Layout/AuthLayout";
import ResetPassword from "./components/Auth/ResetPassword";
import VerifyEmailForm from "./components/Auth/VerifyEmailForm";

const App: React.FC = () => {


  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LayoutHome />} >
            <Route path="/" element={<Home/>} />
          </Route>
          {/* <Route element={<AuthLayout />}> */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyEmailForm/>} />
          {/* </Route> */}
          <Route path="/" element={<Layout />}>
            <Route path="today" element={<Today />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="overdue" element={<Overdue />} />
            <Route path="upcoming" element={<Upcoming />} />
            <Route path="archived" element={<Archived />} />
            <Route path="list" element={<MyListPage />} />
            <Route path="list/:id/:name" element={<ListDetailPage />} />
            <Route path ="userprofile" element={<UserProfilePage/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
