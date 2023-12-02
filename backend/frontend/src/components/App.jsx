import React from "react";
import { Route, Routes } from "react-router-dom";
import MainDashboard from "./Adminpannel/Dashboard/mainDashboard";
import Login from "./Adminpannel/Login/login";
// import MainBuyer from "./Buyerside/MainBuyer";
import Temp from "./temp";
import MainBuyer from "./BuyerSide.jsx/MainBuyer";

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<MainBuyer />} />
      <Route path="/admin" element={<Login />}>
        <Route path="mainDashboard/*" element={<MainDashboard />} />
      </Route>
    </Routes>
  );
}
