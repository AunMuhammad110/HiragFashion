import React, { Suspense } from "react";
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
import { CountProvider } from "./GlobalData/cartContext/cartData";
import ScrolToTop from "../Customhooks/scrolltotop";
import SimpleBackdrop from "../Components/fullPageLoader";
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


// Lazy load components using React.lazy
const LazyCarrousalSectionWrapper = React.lazy(() => import("./MainPage"));
const LazyMainProductSection = React.lazy(() => import("./ProductSection/mainSection"));
const LazyImageGallery = React.lazy(() => import("./Card/Detailcard"));
const LazyPrivacyPolicy = React.lazy(() => import("./StaticPages/PrivacyPolicy"));
const LazyTermsCondition = React.lazy(() => import("./StaticPages/TermsCondiiton"));
const LazyCustomTailoring = React.lazy(() => import("./StaticPages/CustomTailoring"));
const LazyFaqs = React.lazy(() => import("./StaticPages/Faqs"));
const LazyAboutUs = React.lazy(() => import("./StaticPages/AboutUs"));
const LazyExchangePolicy = React.lazy(() => import("./StaticPages/ExchangePolicy"));
const LazyWhatsAppPopUp = React.lazy(() => import("./WhatsappComponent/whatsapp"));
const LazyFooter = React.lazy(() => import("./footer/footer"));

const queryClient = new QueryClient();

function MainBuyer(props) {
  return (
    <>

      <QueryClientProvider client={queryClient}>
      {/* <Suspense fallback={<SimpleBackdrop/>}> */}
      <CountProvider>
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
        </CountProvider>
        <NotificationController />
      </QueryClientProvider>
      <WhatsAppPopUp />
    </>
  );
}

export default MainBuyer;
