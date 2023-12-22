import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../others/Navbar";
import Footer from "../pages/Footer/Footer";

const LayoutHome = () => {
  return (
    <div>
      <Navbar />

      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LayoutHome;
