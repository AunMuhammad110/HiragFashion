import axios from "axios";
import { nanoid } from "nanoid";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useRef, useState } from "react";

import "./updateproduct.css";
import CategoryContext from "./details";
import useBoolean from "../../../Customhooks/boolean";
import axiosClient from "../../../../apisSetup/axiosClient";

const UpdateProduct= React.memo(()=> {
  const {categoryList,CallData} = useContext(CategoryContext);
  const [displayCategory, setDisplayCategory] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [productformData, setProductFormData] = React.useState({
    brandName: categoryList[0],
    subBrandName: "",
    productName: "",
    category: "",
    price: Number,
    stock: Number,
    discountPrice: Number,
    productWeight: Number,
    productDetails: "",
  });

  const image1Ref = useRef();
  const image2Ref = useRef();
  const image3Ref = useRef();

  const [showImageInputs, { setToggle: setShowImageInputs }] =
    useBoolean(false);
  const [showImage, { setToggle: setShowImage }] = useBoolean(false);
  const [image, setImage] = useState([]);
  const [productId, setProductId] = useState("");

  function convertToBase64(e) {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
  
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Set canvas dimensions based on the desired width and height
        const maxWidth = 800;
        const maxHeight = 800;
  
        let width = img.width;
        let height = img.height;
  
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, width, height);
  
        // Convert the canvas content to base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.9); // Adjust quality (0.9 is just an example)
  
        // Add the compressed image to the image array
        setImage([...image, compressedBase64]);
      };
    };
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setProductFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  const FetchProduct = debounce((e) => {
    axiosClient
      .post("/GetProduct", { productId: productId })
      .then((response) => {
        if (response.status === 200) {
          // Product data successfully retrieved
          toast.success("Product data successfully retrieved");
          const productData = response.data;
          if (productData) {
            // Update the product form data with the fetched data
            setProductFormData({
              category: productData.brandName,
              subBrandName: productData.subBrandName,
              productName: productData.productTitle || "",
              price: productData.productPrice || 0,
              stock: productData.stockCount || 0,
              productWeight: productData.productWeight || 0,
              discountPrice: productData.discountPrice || "",
              productDetails: productData.productDetails || "",
            });
            setDisplayCategory(false);
            setImage(productData.images || []);
            setDisplayCategory(true);
            setShowImage(true);
          } else if (response.status === 404) {
            toast.error("Product not found");
          }
        }
      })
      .catch((error) => {
        // Handle any other errors here
        toast.error("Product not found");
        console.error(error);
      });
  }, 500);


  const RemoveProduct = debounce(() => {
    axiosClient
      .post("/DeleteProduct", { productId })
      .then((response) => {
      })
      .catch((error) => {
        toast.error("Product not found");
        console.log("Server error: " + error.message);
      });
  }, 500); 

  useEffect(() => {
    axiosClient
      .post("/GetSubCategoryList", {
        brandName: productformData.brandName,
      })
      .then((response) => {
        if (response.status === 200) {
          setSubCategoryList(response.data.subCategory);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [productformData.brandName]);

  function RemoveImages() {
    setImage([]);
    setDisplayCategory(false);
    setShowImageInputs();
  }

  const AddProduct = async () => {
    let productId = nanoid(8);
    // e.preventDefault();
    if (!productformData.category || !productformData.subBrandName) {
      toast.error("Please fill the required inputs");
      return;
    }

    try {
      // Send the product data to be uploaded
      const productResponse = await axiosClient.post(
        "/UploadProduct",
        {
          image,
          productformData,
          productId,
        }
      ).then((response) => {
        setProductFormData({
          productName: "",
          category: "",
          subBrandName: "",
          price: Number,
          stock: Number,
          discountPrice: Number,
          productWeight: Number,
          productDetails: "",
        }); 
          setShowImageInputs(false);
          setDisplayCategory(false);
          setImage([]);
          if(image1Ref.current ) image1Ref.current.value=null;
          if(image2Ref.current ) image2Ref.current.value=null;
          if(image3Ref.current ) image3Ref.current.value=null;
          toast.success("Product Updated successfully");
      })
    } catch (error) {
      toast.error("Failed to upload the product or images.");
    }
  };


  function Handler(){
    RemoveProduct();
    AddProduct()

  }
  return (
    <div className="update-product-container">
      <h1>Update the Product</h1>
      <div className="get-productid-container">
        <div>
          <label htmlFor="product-id">Enter Product ID:</label>

          <input
            type="text"
            id="product-id"
            onChange={(event) => setProductId(event.target.value)}
            value={productId}
            required
            placeholder="Enter Product ID"
          />
        </div>
        <button onClick={FetchProduct}>Get Product</button>
      </div>

      <div className="product-form">
        <div className="form-group"></div>
        <div className="form-group">
          <label htmlFor="category">Select Brand Name</label>
          <select
            name="brandName"
            onChange={handleChange}
            value={productformData.brandName}
            id="category"
            style={{ width: "15vw" }}
            required
          >
            {categoryList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Select Sub Category</label>
          <select
            name="subBrandName"
            onChange={handleChange}
            value={productformData.subBrandName}
            id="category"
            style={{ width: "15vw" }}
            required
          >
            {subCategoryList.map((category, index) => (
              <option key={category.subBrandName} value={category.subBrandName}>
                {category.subBrandName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="productName">Product Title:</label>
          <input
            style={{ width: "50vw" }}
            type="text"
            placeholder="Enter Product Title"
            name="productName"
            onChange={handleChange}
            value={productformData.productName}
            required
            id="productName"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Original Price:</label>
          <input
            style={{ width: "15vw" }}
            type="number"
            placeholder="Enter Original Price"
            name="price"
            onChange={handleChange}
            value={productformData.price}
            required
            id="price"
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountPrice">
            Discounted Price:{" "}
            <p
              style={{
                display: "inline",
                "font-weight": "200",
                "font-size": "14px",
              }}
            >
              (optional)
            </p>
          </label>
          <input
            style={{ width: "15vw" }}
            type="number"
            placeholder="Enter Discounted Price"
            name="discountPrice"
            onChange={handleChange}
            value={productformData.discountPrice}
            id="discountPrice"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock Count:</label>
          <input
            style={{ width: "15vw" }}
            type="number"
            placeholder="Enter Stock Count"
            name="stock"
            onChange={handleChange}
            value={productformData.stock}
            required
            id="stock"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Product Weight:</label>
          <input
            style={{ width: "15vw" }}
            type="number"
            placeholder="Enter Product  Weight"
            name="productWeight"
            onChange={handleChange}
            value={productformData.productWeight}
            required
            id="stock"
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDetails">Product Details:</label>
          <textarea
            style={{ width: "50vw" }}
            placeholder="Enter Product Details"
            cols="30"
            rows="10"
            name="productDetails"
            onChange={handleChange}
            value={productformData.productDetails}
            required
            id="productDetails"
          />
        </div>

        {showImageInputs && (
          <>
            {" "}
            <div className="form-group">
              <label htmlFor="image1">Product Image 1:</label>
              <input
                type="file"
                style={{ width: "15vw" }}
                placeholder="Input Product Image"
                name="image1"
                onChange={convertToBase64}
                accept="image/*"
                required
                id="image1"
                ref={image1Ref}
              />
            </div>
            <div className="form-group">
              <label htmlFor="image2">
                Product Image 2:{" "}
                <p
                  style={{
                    display: "inline",
                    "font-weight": "200",
                    "font-size": "14px",
                  }}
                >
                  (optional)
                </p>
              </label>
              <input
                style={{ width: "15vw" }}
                type="file"
                placeholder="Input Product Image"
                onChange={convertToBase64}
                name="image2"
                accept="image/*"
                id="image2"
                ref={image2Ref}
              />
            </div>
            <div className="form-group">
              <label htmlFor="image3">
                Product Image 3:{" "}
                <p
                  style={{
                    display: "inline",
                    "font-weight": "200",
                    "font-size": "14px",
                  }}
                >
                  (optional)
                </p>
              </label>
              <input
                type="file"
                style={{ width: "15vw" }}
                placeholder="Input Product Image"
                onChange={convertToBase64}
                name="image3"
                accept="image/*"
                id="image3"
                ref={image3Ref}
              />
            </div>
          </>
        )}

        <button className="product-update-button" onClick={Handler}>
          {" "}
          Update Changes
        </button>
      </div>

      {displayCategory && (
        <div className="image-container">
          <h1>Previous Images</h1>
          <div>
            {image.map((imageSrc, index) => (
              <img
                key={index}
                src={imageSrc}
                alt={`Product Image ${index + 1}`}
              />
            ))}
            <br />
            <button onClick={RemoveImages}>Delete Images</button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
});
export default UpdateProduct;