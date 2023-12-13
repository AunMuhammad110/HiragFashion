import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../apisSetup/axiosClient";
import { useRequestProcessor } from "../../../apisSetup/requestProcessor";
import "./card.css";
import ImageCarousel from "./crousel-img";
import ZoomImage from "./zoomImage";
import ProductCard from "../ProductSection/brandCards/brandCards";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const ImageGallery = React.memo(() => {
  const locationData = useLocation();
  const {
    state: { id, parentCollection },
  } = locationData;
  const [number, setNumber] = useState(0);
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
            `/buyerSide/GetProductDetails/${id}`,{
              params:{parentCollection}
            }
          );
          setProductData(res.data);
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
  function AddDataLocalStorage() {
    if (number === 0) {
      setShowButtonError(true);
      return;
    }
    setShowButtonError(false);
    let prevShoppingData =
      JSON.parse(window.localStorage.getItem("SHOPPING_DATA")) || [];

    const productInfo = {
      productId: productData.productId,
      productCount: number,
    };

    // Check if the productId is already in the array
    const existingProductIndex = prevShoppingData.findIndex(
      (item) => item.productId === productData.productId
    );

    if (existingProductIndex !== -1) {
      // If productId exists, update the productCount
      prevShoppingData[existingProductIndex].productCount = number;
    } else {
      // If productId doesn't exist, add a new object to the array
      prevShoppingData.push(productInfo);
    }


    // Save the updated array back to localStorage
    window.localStorage.setItem(
      "SHOPPING_DATA",
      JSON.stringify(prevShoppingData)
    );
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  }

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
                {productData.productId}&nbsp;<span className="bar">|</span>
                &nbsp;{" "}
                <span className="text-success">
                  {productData.stockCount > 0 ? "IN STOCK" : "Out of Stock"}
                </span>
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
                  Only <span className="colr">{productData.stockCount}</span>{" "}
                  left..!{" "}
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

            <div className="row">
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
                  <p className="colr">Can not buy {number}, only 4 left</p>
                )}
                {showButtonError && (
                  <p className="colr">Please Select Qunatity of Product</p>
                )}
              </div>

              <div className="d-flex f-direction-row">
                <button
                  type="button"
                  className="col-5 button-86"
                  disabled={showError}
                  onClick={AddDataLocalStorage}
                >
                  Bag it Now!
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
              <h6>Product Details</h6>
              <ul className="px-5">
                {productData.splitProductDetails.map((item, key) => {
                  return <li key={key}>{item}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
     {productData?.relatedProducts && (
  <div className="related-products-main">
  <p>RELATED PRODUCTS</p>
  <div className="related-products-container">
    {productData.relatedProducts.map((item) => {
      if (item.productId != id) {
        return (
          <ProductCard
            className={"change-height"}
            item={item}
            parentCollection={parentCollection}
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
      </span>{" "}
      BACK TO {parentCollection.name.toUpperCase()}
    </button>
  </div>
</div>
)}


      </div>
    )
  );
});

export default ImageGallery;


