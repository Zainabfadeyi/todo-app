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
import PrivateRoute from "./components/Auth/PrivateRoute";
import { useSelector } from 'react-redux';
import { RootState } from './app/store';

const App: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LayoutHome />} >
          <Route path="/" element={<Home/>} />
            </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* <Route
            path="/"
            element={<Layout />}
          >
            <PrivateRoute
              path="inbox"
              element={<Inbox />}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="today"
              element={<Today />}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="list"
              element={<MyListPage />}
              isAuthenticated={isAuthenticated}
            />
            <PrivateRoute
              path="list/:id/:name"
              element={<ListDetailPage />}
              isAuthenticated={isAuthenticated}
            />
           {/* This is where the child routes will be rendered */}
          {/* </Route> */}
          <Route path="/" element={<Layout />}>
            <Route path="inbox" element={<Inbox />} />
            <Route path="today" element={<Today />} />
            <Route path="list" element={<MyListPage />} />
            <Route path="list/:id/:name" element={<ListDetailPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
