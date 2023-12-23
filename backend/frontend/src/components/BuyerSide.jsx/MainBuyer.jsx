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
import SubTree from "./useContextt/routeescomp";
import Feedback from "./staticPages/feedback";

const MainLayout = ({ children }) => (
  <>
    <Navbarr />
    {children}
    <NotificationController />
    <WhatsAppPopUp />
    <Footer />
  </>
);



export default function MainBuyer(props) {
  const queryClient = new QueryClient();
  return (
    <>

      <QueryClientProvider client={queryClient}>
        <MainDataProvider>
          <Routes>
            <Route path="/" element={<MainLayout>
              <CarrousalSectionWrapper />
            </MainLayout>} />
            <Route path="/product-section" element={<MainLayout>
              <MainProductSection />
            </MainLayout>} />
            <Route path="/product-detail" element={<MainLayout>
              <ImageGallery />
            </MainLayout>} />
            <Route
              path="/terms-condition"
              element={
                <MainLayout>
                  <TermsCondition />
                </MainLayout>
              }
            />
            <Route
              path="/shipping-policy"
              element={
                <MainLayout>
                  <PrivacyPolicy /></MainLayout>} />
            <Route path="/custom-tailoring" element={<MainLayout><CustomTailoring /></MainLayout>} />
            <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
            <Route path="/faqs" element={<MainLayout><Faqs /></MainLayout>} />
            <Route path="/context/*" element={<SubTree />}></Route>
            <Route path="/exchange-policy" element={<MainLayout><ExchangePolicy /></MainLayout>} />
            <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
            <Route path="/main-products" element={<MainLayout><MainPageProducts /></MainLayout>} />
            <Route path="/feed-form" element={<MainLayout><Feedback/></MainLayout>}></Route>
          </Routes>
        </MainDataProvider>
        <NotificationController />
      </QueryClientProvider>
      <WhatsAppPopUp />
      {/* <Footer /> */}
    </>
  );
}
