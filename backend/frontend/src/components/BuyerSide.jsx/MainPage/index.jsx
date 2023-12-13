import React, { useEffect } from "react";
import Crousel from "./Crousel/crousel";
import SectionController from "./SubBrandSection/SectionControler";
import MainPageProducts from "./MainPageProducts";

export default function CarrousalSectionWrapper() {
    useEffect(() => {
        if(!window.localStorage.getItem("SHOPPING_DATA")){
            window.localStorage.setItem("SHOPPING_DATA",JSON.stringify([]));
        }
    },[]);
  return (
    <>
      <Crousel /> 
      <SectionController />
      <MainPageProducts/>
    </>
  );
}
