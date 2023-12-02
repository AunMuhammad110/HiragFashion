import React from "react";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Footer from "./footer/footer";
import Navbarr from "./Navbarr/navbar";

import MainProductSection from "./ProductSection/mainSection";
import CarrousalSectionWrapper from "./MainPage";
import { MainDataProvider } from "./GlobalData/MainPage";
import ImageGallery from "./Card/Detailcard";
import PrivacyPolicy from "./staticPages/PrivacyPolicy";
import TermsCondition from "./staticPages/TermsCondiiton";
import CustomTailoring from "./staticPages/CustomTailoring";
import Faqs from "./staticPages/Faqs";
import AboutUs from "./staticPages/AboutUs";

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
          </Routes>
        </MainDataProvider>
      </QueryClientProvider>
      
      <Footer />
    </>
  );
}
