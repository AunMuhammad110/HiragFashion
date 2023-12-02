import React from "react";
import Crousel from "./Crousel/crousel";
import { useNavigate } from "react-router-dom";
import SectionController from "./SubBrandSection/SectionControler";

export default function CarrousalSectionWrapper(){
    const navigate=useNavigate();
    function Navigator(name, id){
        navigate('/product-section',{state:{name: name, id:id}})
        }
    
    return(
        <>
         <Crousel/>
        <SectionController/>
        </>
    )
}