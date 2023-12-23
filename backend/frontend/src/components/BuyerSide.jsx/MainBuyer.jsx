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
      <Suspense fallback={<SimpleBackdrop/>}>
        <MainDataProvider>
          <CountProvider>
            <Navbarr />
            <ScrolToTop />
            
              <Routes>
                <Route path="/" element={<LazyCarrousalSectionWrapper />} />
                <Route path="/product-section" element={<LazyMainProductSection />} />
                <Route path="/product-detail" element={<LazyImageGallery />} />
                <Route path="/terms-condition" element={<LazyTermsCondition />} />
                <Route path="/shipping-policy" element={<LazyPrivacyPolicy />} />
                <Route path="/custom-tailoring" element={<LazyCustomTailoring />} />
                <Route path="/about-us" element={<LazyAboutUs />} />
                <Route path="/faqs" element={<LazyFaqs />} />
                <Route path="/exchange-policy" element={<LazyExchangePolicy />} />
                <Route path="/privacy-policy" element={<LazyPrivacyPolicy />} />
                <Route path="/main-products" element={<MainPageProducts />} />
              </Routes>
            
          </CountProvider>
        </MainDataProvider>
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <NotificationController />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <LazyWhatsAppPopUp />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <LazyFooter />
        </Suspense>
      </QueryClientProvider>
    </>
  );
}

export default MainBuyer;
