import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import MainDashboard from "./Adminpannel/Dashboard/mainDashboard";
import Login from "./Adminpannel/Login/login";
import MainBuyer from "./BuyerSide.jsx/MainBuyer";
import Test from "./test2";
import Test1 from "./test";
import ScrollToTop from "./Customhooks/scrolltotop";

export default function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        {/* <Route path="/" element={<Test />} />
        <Route path="/test-1" element={<Test1 />} /> */}
        <Route path="/*" element={<MainBuyer />} />
        <Route path="/admin" element={<Login />}>
          <Route path="mainDashboard/*" element={<MainDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}
