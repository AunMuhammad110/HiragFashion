import React from "react";
import Temp from "./Buyerside/temp";
import Login from "./Adminpannel/Login/login";
import { Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from "./Adminpannel/Dashboard/mainDashboard";
import { CategoryProvider } from "./Adminpannel/Dashboard/Product/details";
export default function App() {
  return (
    <CategoryProvider>
      <Routes>
        <Route path="/" element={<Temp />} />
        <Route path="/admin" element={<Login />}>
          {/* Correct the nested route path */}
          <Route path="mainDashboard/*" element={<MainDashboard />} />
        </Route>
      </Routes>
    </CategoryProvider>
  )
}
