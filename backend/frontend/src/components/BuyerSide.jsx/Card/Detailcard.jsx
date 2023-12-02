import React, { useState, useEffect } from "react";
import NumberControl from "./counter";
import "./card.css";
import ZoomImage from "./zoomImage";
import ImageCarousel from "./crousel-img";
import img1 from "./imgs/23.jpg";
import img2 from "./imgs/cr2.jpg";
import img3 from "./imgs/cr1.jpg";
import img4 from "./imgs/hania.jpg";
import { useLocation } from "react-router-dom";
import { useRequestProcessor } from "../../../apisSetup/requestProcessor";
import axiosClient from "../../../apisSetup/axiosClient";

const ImageGallery = React.memo(() => {
    const { query } = useRequestProcessor();
    const locationData = useLocation(); 
    const [productData, setProductData] =useState({})// Move useLocation inside the component
    const [smallImagesVisible, setSmallImagesVisible] = useState(true);
    const [selectedImage, setSelectedImage] = useState([]);
    const {isLoading,isError}=query(
    "users",
    () =>
      axiosClient
        .get(`/buyerSide/GetProductDetails/${locationData.state.id}`)
        .then((res) => {
        //   alert("success");
          setProductData(res.data);
          return res.data;
        }),
    { enabled: true }
  );
  useEffect(() => {
    // Check the screen width and hide small images on mobile screens
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSmallImagesVisible(false);
      } else {
        setSmallImagesVisible(true);
      }
    };
    // Add an event listener for window resize
    window.addEventListener("resize", handleResize);
    // Initial check when the component mounts
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  if(Object.keys(productData).length === 0){
    
    return (
        <p>Loading...</p>
    )
  }
  else{
    console.log("the data is ", productData)
  }

  const smallImages = productData.images;


  const handleClick = (image) => {
    setSelectedImage(image);
  };
  console.log("ot os rerendering...");

  return (
    Object.keys(productData).length > 0 && (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 shadoww pr-4">
            <div className="image-gallery shadoww">
              {
                // this is for large screen
                smallImagesVisible && (
                  <div className="large-image">
                    <ZoomImage src={productData.images[0]} />
                  </div>
                )
              }

              {/* below code is for mobile screen */}
              {!smallImagesVisible && (
                <div className="large-image">
                  {selectedImage && <ImageCarousel images={smallImages} />}
                </div>
              )}

              {/* this code is for small images of laptop screen */}
              {smallImagesVisible && (
                <div className="small-images">
                  {smallImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Small Image ${index}`}
                      onClick={() => handleClick(image)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 container my-4">
            <div className="row">
              <div className="bordder"></div>
              {/* add the name of the product + category  */}
              <h2>{productData.productTitle}</h2>

              {/* below add the product ID  */}
              <div className="sub-cat">
                {" "}
                {productData.productId}&nbsp;<span className="bar">|</span>&nbsp;{" "}
                <span className="text-success">{productData.stockCount > 0? "IN STOCK" :"Out of Stock" }</span>
              </div>

              <div className="bordder col-12"></div>
            </div>
            {/* First Row ending */}

            <div className="row">
              <div className="col-7">
                {/* below add the price of the product */}
                <div className="bold">
                  <p className="bold">
                    {" "}
                    Rs <span>{productData.productPrice}</span>
                  </p>
                </div>

                {/* Add how many suits are left*/}
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 500,
                    marginTop: "10px",
                  }}
                >
                  Only <span className="colr">{productData.stockCount}</span> left..!{" "}
                </div>
              </div>

              <div className="col-5 my-3">
                {/* Favourite Icon */}
                <a href="#" className="anchorr">
                  <i
                    className="fa fa-heart-o"
                    id="bag-Icon"
                    aria-hidden="true"
                  ></i>
                  &nbsp;<p className="txt"></p>
                </a>
              </div>
              {/* Second row closes here */}
            </div>

            {/* <div><h3>Qty</h3></div> */}
            <div className="row">
              <div className="pb-4">{<NumberControl />}</div>

              <div className="d-flex f-direction-row">
                {/* Button for confirming order */}
                <button type="button" className="col-5 button-86">
                  Bag it Now!
                </button>
                <div className="col-6">
                  <p className="txt-ship">
                    Shipment will be deliver within one weeks
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <h6>Product Details</h6>
              <ul className="px-5">
                  {productData.splitProductDetails.map((item,key)=>{
                    return( <li key={key}>{item}</li>)
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
});

export default ImageGallery;
