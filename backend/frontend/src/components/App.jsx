import React, { lazy, Suspense } from "react";
import Login from "./Adminpannel/login/login";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import MainBuyer from "./BuyerSide.jsx/MainBuyer";
import ScrollToTop from "./Customhooks/scrolltotop";

const MainDashboard = lazy(() => import("./Adminpannel/Dashboard/mainDashboard"));
const AdminDashboardWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MainDashboard />
  </Suspense>
);
const BuyerWithSuspense = () => (
  <Suspense fallback={<div><h1>Load karrha hun</h1></div>}>
    <MainBuyer />
  </Suspense>
);
export default function App() {
  return (
    <div>
      <ScrollToTop />
        
      <Routes>
        <Route path="/*" element={<BuyerWithSuspense />} />
        <Route path="/admin" element={<Login />}>
        <Route path="/admin/mainDashboard/*" element={<AdminDashboardWithSuspense />} />
        </Route>
      </Routes>
    </div>
  );
}
