import React from "react";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Footer from "./footer/footer";
import Navbarr from "./Navbarr/navbar";

import MainProductSection from "./ProductSection/mainSection";
import CarrousalSectionWrapper from "./MainPage";
import { MainDataProvider } from "./GlobalData/MainPage";
import ImageGallery from "./Card/Detailcard";
import PrivacyPolicy from "./StaticPages/PrivacyPolicy";
import TermsCondition from "./StaticPages/TermsCondiiton";
import CustomTailoring from "./StaticPages/CustomTailoring";
import Faqs from "./StaticPages/Faqs";
import AboutUs from "./StaticPages/AboutUs";
import ExchangePolicy from "./StaticPages/ExchangePolicy";
import WhatsAppPopUp from "./WhatsappComponent/whatsapp";
import NotificationController from "./Notification";
import MainPageProducts from "./MainPage/MainPageProducts";


export default function MainBuyer(props) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MainDataProvider>
          <Navbarr/>
          <Routes>
            <Route path="/" element={<CarrousalSectionWrapper />}/>
            <Route path="/product-section" element={<MainProductSection/>}/>
            <Route path="/product-detail" element={<ImageGallery/>}/>
            <Route path="/terms-condition" element={<TermsCondition/>}/>
            <Route path="/shipping-policy" element={<PrivacyPolicy/>}/>
            <Route path="/custom-tailoring" element={<CustomTailoring/>}/>
            <Route path="/about-us" element={<AboutUs/>}/>
            <Route path="/faqs" element={<Faqs/>}/>
            <Route path="/exchange-policy" element={<ExchangePolicy/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/main-products" element={<MainPageProducts/>}/>
          </Routes>
        </MainDataProvider>
     
      <NotificationController/>
      </QueryClientProvider>
      <WhatsAppPopUp />
      <Footer />
    </>
  );
}
