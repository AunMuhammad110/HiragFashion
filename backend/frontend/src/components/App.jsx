import React, { lazy, Suspense } from "react";
import Login from "./Adminpannel/Login/login";
import { Route, Routes } from "react-router-dom";
import MainBuyer from "./BuyerSide.jsx/MainBuyer";
import ScrollToTop from "./Customhooks/scrolltotop";

const MainDashboard = lazy(() => import("./Adminpannel/Dashboard/mainDashboard"));
const AdminDashboardWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MainDashboard />
  </Suspense>
);
export default function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<MainBuyer />} />
        <Route path="/admin" element={<Login />}>
        <Route path="/admin/mainDashboard/*" element={<AdminDashboardWithSuspense />} />
        </Route>
      </Routes>
    </div>
  );
}
