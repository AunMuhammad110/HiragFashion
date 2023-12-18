import Stack from "@mui/material/Stack";
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState, useRef } from "react";
import SmsFailedOutlinedIcon from "@mui/icons-material/SmsFailedOutlined";

import "./index.css";
import ProductCard from "./brandCards/brandCards";
import axiosClient from "../../../apisSetup/axiosClient";
import { useRequestProcessor } from "../../../apisSetup/requestProcessor";

export default function MainProductSection() {
  const location = useLocation();
  const [tag, setTag] = useState("Title");
  const { mutate } = useRequestProcessor();
  const [productData, setProductData] = useState([]);
  const [showMore,setShowMore]=useState(false);
  const [offsetCount,setOffsetCount] = useState(1);

  useEffect(() => {
    setTag(location?.state?.name);
  }, [location?.state]);

  // const {data, isLoading, isError} =query("productData", async ()=>{
  //     try{
  //       const response =axiosClient.get("/buyerSide/GetProducts",{params:{offset:1}})
  //       setProductData(response.data);
  //       if(response.data.length ===25) setShowMore(true);
  //       return response.data;
  //     }
  //     catch(error){
  //       console.error("Error fetching product data:", error);
  //       throw error;
  //     }
  // })
  const mutation = mutate("unique", async () => {
    try {
      const response = await axiosClient.post(
        "/buyerSide/GetProducts",{
        locationData:location.state,
        offsetCount:offsetCount}

      )
      if(!productData.length ===0){
        if(productData[0].brandName===response.data[0].brandName && productData[0].subBrandName===response.data[0].subBrandName  ){
          setProductData([...productData, ...response.data]);
        }
      }
      else{
        setProductData(response.data);
      }
      if(response.data.length ===25) setShowMore(true);
    } catch (error) {
      console.error("Error:", error);
    }
  });
  useEffect(() => {
    mutation.mutate();
  }, [location,offsetCount]);
  useEffect(() => {
    if(productData.length % 25 !== 0){
      setShowMore(false);
    }
  },[productData])
  useEffect(()=>{
    setProductData([]);
  },[location])
  if (mutate.isLoading) {
    return <></>;
  }

  if (productData.length === 0) {
    return (
      <div className="product-main-container">
        <h1>{tag}</h1>
        <div className="display-flex custom-no-products">
          <SmsFailedOutlinedIcon />
          <p className="no-products-tag">
            No products are avalible in this category.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="product-main-container">
      <h1>{tag}</h1>
      <div className="sub-product-main">
        <div className="main-card-container">
          {productData?.map((item, index) => {
            // {console.log("item data is ", item) }
            return (
              // <></>
              <ProductCard
                key={index}
                item={item}
                parentCollection={{name:"Asim Jofa", id:1}}
              />
            );
          })}
        </div>
      </div>
      {showMore && <div className="related-product-button custom-view"><button className="" onClick={()=>setOffsetCount(offsetCount +1)}> View More Products </button></div>}
    </div>
  );
}
