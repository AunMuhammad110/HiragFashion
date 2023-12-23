import React from "react";
import Navbar from "./Navbar/navbar";
import { Routes, Route ,useLocation} from 'react-router-dom'; // Removed unused imports
import Order from "./order/order";
import UpdateProduct from "./Product/UpdateProduct";
import DeleteProduct from "./Product/DeleteProduct";
import UploadProduct from "./Product/Upload";
import CarrousalSettings from "./CarrousalSettings/carrousal"; // Corrected the import name
import Notifications from "./Notifications/notifications";
import DeliverPrice from "./DeliverRates/deliveryrates";
import { CategoryProvider } from "./Product/details";
import MainPageProductsSettings from "./MainPageProducts";
import { QueryClient, QueryClientProvider } from "react-query";
import ScrollToTop from "../../Customhooks/scrolltotop";
import FeedBack from "./Reviews/FeedResponse";
export default function MainDashboard(props) {
  const queryClient = new QueryClient();
  const {pathname} = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Navbar />
      <QueryClientProvider client={queryClient}>
      <CategoryProvider>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/uploadProduct" element={<UploadProduct />} />
        <Route path="/updateProduct" element={<UpdateProduct />} />
        <Route path="/deleteProduct" element={<DeleteProduct />} />
        <Route path="/carrousalSettings" element={<CarrousalSettings />} />
        <Route path="/notification" element={<Notifications/>} />
        <Route path="/deliveryprice" element={<DeliverPrice/>} />
        <Route path="/product-settings" element={<MainPageProductsSettings/>} />
        <Route path="/contact" element={<FeedBack/>}/>
      </Routes>
      </CategoryProvider>
      </QueryClientProvider>
     
    </>
  );
}
