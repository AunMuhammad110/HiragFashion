import React, { useEffect, useState } from "react";
import SubBrandCards from "./subBrandCards/subBrandCards";
import "./subBrandSection.css";
export default function SubBrandSection(props) {
  const [brandName, setBrandName]=useState("");
  useEffect(()=>{
    setBrandName(Object.keys(props.data)[0])
  },[])
  return (
    props.data[brandName]?.length >0?   <div className="sub-brand-section">
    <p style={{ textAlign: "center" }}> {brandName.toUpperCase()}</p>
    <div className="grid-container">
    {brandName.length>0 && props.data[brandName].map((item, index) => (
      <SubBrandCards subBrandName={item.subBrandName} image={item.image} key={index} id={props.id} />
    ))}
    </div>
  </div> :<></>
 
  );
}
