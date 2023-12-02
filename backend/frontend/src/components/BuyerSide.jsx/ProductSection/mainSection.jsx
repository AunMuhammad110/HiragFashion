import Stack from "@mui/material/Stack";
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState } from "react";
import SmsFailedOutlinedIcon from "@mui/icons-material/SmsFailedOutlined";

import "./index.css";
import ProductCard from "./brandCards/brandCards";
import axiosClient from "../../../apisSetup/axiosClient";
import { useRequestProcessor } from "../../../apisSetup/requestProcessor";


export default function MainProductSection() {
  const { mutate } = useRequestProcessor();
  const [productData, setProductData] = useState([]);
  const location = useLocation();
  console.log(location.state);
  const[tag, setTag]= useState("Title");
  const [product, setProduct] = useState([
    <ProductCard />,
    <ProductCard />,
    <ProductCard />,
    <ProductCard />,
    <ProductCard />,
    <ProductCard />,
    <ProductCard />,
  ]);
  const [page, setPage] = React.useState(1);


  const handleChange = (event, value) => {
    setPage(value);
    console.log(page);
  };
  useEffect(()=>{
    setTag(location.state.name)
  },[location.state])

  const mutation =mutate("unique", async () => {
    try {
      const response = await axiosClient.post('/buyerSide/GetProducts',location.state);
      setProductData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  });
  useEffect(()=>{
    mutation.mutate();
  },[location])
  if(mutation.isLoading)
  {
    return <p>Loading....</p>
  }


  if(productData.length ===0 ){
    return <div className="product-main-container"> 
    <h1>{tag}</h1>
          <div className="display-flex custom-no-products"><SmsFailedOutlinedIcon/>
          <p className="no-products-tag">No products are avalible in this category.</p> 
          </div>
    </div>
  }

  if(productData){
    console.log(productData)
  }
  return (
    <div className="product-main-container">
      <h1>{tag}</h1>
      <div className="sub-product-main">
        <div className="main-card-container">
          {/* {product.map((item, index) => (
            <div key={index}>{item}</div>
          ))} */}
          {productData.map((item, index) => {
            return(
            <ProductCard key={index} item={item}/>)
          })}
        </div>
        <div className="pagination">
          <Stack spacing={2}>
            <Pagination count={3} page={page} onChange={handleChange} />
          </Stack>
        </div>
      </div>
            

    </div>
  );
}
