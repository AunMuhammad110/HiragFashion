import React from "react";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Footer from "./footer/footer";
import Navbarr from "./Navbarr/navbar";

import MainProductSection from "./ProductSection/mainSection";
import CarrousalSectionWrapper from "./MainPage";
import { MainDataProvider } from "./GlobalData/MainPage";
import ImageGallery from "./Card/Detailcard";

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
          </Routes>
        </MainDataProvider>
      </QueryClientProvider>
      
      <Footer />
    </>
  );
}
