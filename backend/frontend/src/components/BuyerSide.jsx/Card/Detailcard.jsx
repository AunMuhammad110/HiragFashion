import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../apisSetup/axiosClient";
import { useCount } from "../GlobalData/cartContext/cartData";
import ProductCard from "../ProductSection/brandCards/brandCards";
import "./card.css";
import ImageCarousel from "./crousel-img";
import ZoomImage from "./zoomImage";


const ImageGallery = React.memo(() => {
  const {state,dispatch}= useCount();
  const locationData = useLocation();

  const {
    state: { id, parentCollection },
  } = locationData;
  const [number, setNumber] = useState(1);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({}); // Move useLocation inside the component
  const [showError, setShowError] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [showButtonError, setShowButtonError] = useState(false);
  const [smallImagesVisible, setSmallImagesVisible] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(
          `/buyerSide/GetProductDetails/${id}`, {
          params: { parentCollection }
        }
        );
        setProductData(res.data);
        setSelectedImage(res.data.images[0]);
        return;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [locationData]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSmallImagesVisible(false);
      } else {
        setSmallImagesVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [locationData]);

  useEffect(() => {
    if (number > productData.stockCount) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [number]);

  // useEffect(()=>{
  const [added, setAdded] = useState(false);

  const handleeClick = (productId,quantity) => {
    setAdded(!added);
    setNumber(1);
    AddDataLocalStorage(productId,quantity);
    dispatch({type:'INCREMENT'})
    setTimeout(()=>{
      navigate('/context/chkout')
    },800)
  };

  // },[selectedImage])

  const smallImages = productData.images;

  const handleClick = (image) => {
    setSelectedImage(image);
  };

  const increment = () => {
    setNumber(number + 1);
  };

  const decrement = () => {
    if (number > 0) {
      setNumber(number - 1);
    }
  };
  const AddDataLocalStorage= (productId,quantity) => {
    const existingCartItems = JSON.parse(localStorage.getItem('SHOPPING_DATA')) || [];

    // Check if the product is already in the cart
    const existingCartItemIndex = existingCartItems.findIndex(item => item.productId === productId);
  
    if (existingCartItemIndex !== -1) {
      // Product already exists in the cart, update the quantity
      existingCartItems[existingCartItemIndex].quantity += quantity;
    } else {
      // Product doesn't exist in the cart, add a new item
      const newCartItem = {
        productId,
        quantity,
      };
      existingCartItems.push(newCartItem);
    }
  
    // Update the cart in localStorage
    localStorage.setItem('SHOPPING_DATA', JSON.stringify(existingCartItems));
    // setShowButtonError(false);
    // let prevShoppingData =
    //   JSON.parse(window.localStorage.getItem("SHOPPING_DATA")) || [];

    // const productInfo = {
    //   productId: productData.productId,
    //   quantity: number,
    // };

    // // Check if the productId is already in the array
    // const existingProductIndex = prevShoppingData.findIndex(
    //   (item) => item.productId === productData.productId
    // );

    // if (existingProductIndex !== -1) {
    //   // If productId exists, update the quantity
    //   prevShoppingData[existingProductIndex].quantity = number;
    // } else {
    //   // If productId doesn't exist, add a new object to the array
    //   prevShoppingData.push(productInfo);
    // }


    // // Save the updated array back to localStorage
    // window.localStorage.setItem(
    //   "SHOPPING_DATA",
    //   JSON.stringify(prevShoppingData)∏
    // );
    // setShowSuccessMessage(true);

    // setTimeout(() => {
    //   setShowSuccessMessage(false);
    // }, 3000);
  }
  if(!productData){
    return <></>
  }
  else{
    console.log({productData})
  }
  return (
    <div>
    {Object.keys(productData).length > 0 && (
      <div className="container-fluid wt">
        <div className="row ">
          <div className="col-12 col-md-6 shadoww ">
            <div className="image-gallery shadoww">
              {
                // this is for large screen
                smallImagesVisible && (
                  <div className="large-image">
                    <ZoomImage src={selectedImage} />
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
                  {smallImages?.map((image, index) => (
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

          <div className={`col-md-6 container large-Screen-Right-Side`} style={{ boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)", padding: "20px"}}>
            <div className={`row d-block`}>
              <div className="bordder"></div>
              {/* add the name of the product + category  */}
              <h2 style={{ fontSize: "23px", marginBottom: "3px" }}>{productData.productTitle}</h2>
              {/* below add the product ID  */}
              <div className="sub-cat">
                {" "}
                {productData.productId}&nbsp;<span className="bar">|</span>
                &nbsp;{" "}

                <span className="text-success">
                  {productData.stockCount > 0 ? "IN STOCK" : "Out of Stock"}
                </span>
              </div>

              <div className="bordder"></div>
            </div>
            {/* First Row ending */}

            <div className="row">
              <div className="col-7">
                {/* below add the price of the product */}
                <div className="bold">
                  <p className="bold">
                    {" "}
                    Rs <span>{productData.productPrice}.00 /-</span>
                  </p>
                </div>

                {/* Add how many suits are left*/}
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    marginTop: "4px",
                  }}
                >
                  Only <span className="colr">{productData.stockCount}</span>{" "}
                  left..!{" "}
                </div>
              </div>

              {/* <div className="col-5 my-3">
                {/* Favourite Icon */}
                {/*}
                <a href="#" className="anchorr">
                  <i
                    className="fa fa-heart-o"
                    id="bag-Icon"
                    aria-hidden="true"
                  ></i>
                  &nbsp;<p className="txt"></p>
                </a>
              </div> */}
              {/* Second row closes here */}
            </div>

            <div className="row ">
              <div className="pb-4">
                <div className="number-control">
                  <h3 className="qty">Quantity&nbsp;&nbsp;</h3>
                  <button className="control-button-l" onClick={decrement}>
                    -
                  </button>
                  <div className="number">{number}</div>
                  <button className="control-button-r" onClick={increment}>
                    +
                  </button>
                </div>
                {showError && (
                  <p className="colr">Can not buy {number}, only {productData.stockCount} left</p>
                )}
                {/* {showButtonError && (
                  <p className="colr">Please Select Qunatity of Product</p>
                )} */}
              </div>

              <div className="d-flex f-direction-row">
                {/* <button
                  type="button"
                  className="col-5 button-86"
                  disabled={showError}
                  onClick={AddDataLocalStorage}
                >
                  Bag it Now!
                </button> */}
                <button className={`addtocart ${added ? 'added' : ''}`} onClick={(e)=>handleeClick(productData.productId,number)} disabled={showError}>
                  <div className="pretext">
                    <i className="fas fa-cart-plus"></i> ADD TO CART
                  </div>
                  <div className={`pretext done ${added ? 'added' : ''}`}>
                    <div className="posttext">
                      <i className="fas fa-check"></i> ADDED</div>
                  </div>
                </button>
                <div className="col-6">
                  <p className="txt-ship">
                    Shipment will be deliver within one weeks
                  </p>
                </div>
              </div>
              {showSuccessMessage && (
                <p className="success-message" style={{ color: "green" }}>
                  Item added to the cart successfully
                </p>
              )}
            </div>
            <hr />
            <div className="row">
              <h5><b>Product Details</b></h5>
              </div>
              <div className="row">
              <ul className="px-4">
                {productData?.splitProductDetails?.map((item,index) =>(
                  <li className="font-18" key={index}>{item}</li>
                ))}
              </ul>
              </div>
          </div>
        </div>
        {productData["relatedProducts"] && (
          <div className="related-products-main">
            <p>RELATED PRODUCTS</p>
            <hr />
            <div className="related-products-container">
              {productData.relatedProducts.map((item, index) => {
                if (item.productId != id) {
                  return (
                    <ProductCard
                      className={"change-height"}
                      item={item}
                      parentCollection={parentCollection}
                      key={index}
                    />
                  );
                }
              })}
            </div>

            <div className="related-product-button">
              <button
                onClick={() =>
                  navigate("/product-section", { state: parentCollection })
                }
              >
                <span>
                  <KeyboardBackspaceIcon />
                </span>
                BACK TO {parentCollection.name.toUpperCase()}
              </button>
            </div>
          </div>
        )}
   
      </div>

    )}

    </div>
  );
});

export default ImageGallery;
