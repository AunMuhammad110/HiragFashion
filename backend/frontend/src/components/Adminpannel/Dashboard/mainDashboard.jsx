import React from "react";
import Navbar from "./Navbar/navbar";
import { Routes, Route } from 'react-router-dom'; // Removed unused imports
import Order from "./order/order";
import UpdateProduct from "./Product/UpdateProduct";
import DeleteProduct from "./Product/DeleteProduct";
import UploadProduct from "./Product/Upload";
import CarrousalSettings from "./CarrousalSettings/carrousal"; // Corrected the import name
import Notifications from "./Notifications/notifications";
import DeliverPrice from "./DeliverRates/deliveryrates";
import { CategoryProvider } from "./Product/details";
import FeedBack from "./Reviews/FeedResponse";
export default function MainDashboard(props) {
  return (
    <>
      <Navbar />
      <CategoryProvider>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/uploadProduct" element={<UploadProduct />} />
        <Route path="/updateProduct" element={<UpdateProduct />} />
        <Route path="/deleteProduct" element={<DeleteProduct />} />
        <Route path="/carrousalSettings" element={<CarrousalSettings />} />
        <Route path="/notification" element={<Notifications/>} />
        <Route path="/deliveryprice" element={<DeliverPrice/>} />
        <Route path="/contact" element={<FeedBack/>}/>
      </Routes>
      </CategoryProvider>
     
    </>
  );
}
