  import axios from "axios";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useRef, useState } from "react";

import "./updateproduct.css";
import CategoryContext from "./details";
import useBoolean from "../../../Customhooks/boolean";
import UploadProduct from "./Upload";

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
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage([...image, reader.result]);
    };
    reader.onerror = () => {
      toast.error("failed to convert Imafile to Base64");
      console.log("Error ", error);
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
    axios
      .post("http://localhost:3334/GetProduct", { productId: productId })
      .then((response) => {
        if (response.status === 200) {
          // Product data successfully retrieved
          toast.success("Product data successfully retrieved");
          const productData = response.data;
          console.log(productData);
          if (productData) {
            // Update the product form data with the fetched data
            setProductFormData({
              category: productData.brandName,
              subBrandName: productData.subBrandName,
              productName: productData.productTitle || "",
              price: productData.productPrice || 0,
              stock: productData.stockcount || 0,
              discountPrice: productData.discountPrice || "",
              productDetails: productData.productDetails || "",
            });
            setImage([]);
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
    axios
      .post("http://localhost:3334/DeleteProduct", { productId })
      .then((response) => {
        if (response.status === 200 ) {
          setProductId("");
        } 
      })
      .catch((error) => {
        toast.error("Product not found");
        console.log("Server error: " + error.message);
      });
  }, 500); 

  useEffect(() => {
    axios
      .post("http://localhost:3334/GetSubCategoryList", {
        brandName: productformData.brandName,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.subCategory);
          setSubCategoryList(response.data.subCategory);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productformData.brandName]);

  function RemoveImages() {
    setImage([]);
    setDisplayCategory(false);
    setShowImageInputs();
  }




  const UploadImages = async () => {
    axios
      .post("http://localhost:3334/UploadImages", {
        image2: image[1],
        image3: image[2],
      })
      .then((response) => {
        // Check the response status and handle accordingly
        if (response.status === 200) {
          setImage([]);
          image2Ref.current.value = "";
          image3Ref.current.value = "";
          return true;
        } else {
          // Handle other response statuses (e.g., 409 for a conflict)
          console.log("error occurred in else: " + response.status);
          return false;
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.log("error occur at catch");
        return false;
      });
  };
  const AddProduct = async () => {
    if (!productformData.category || !productformData.subBrandName) {
      toast.error("Please fill the required inputs");
      return;
    }

    try {
      // Send the product data to be uploaded
      const productResponse = await axios.post(
        "http://localhost:3334/UploadProduct",
        {
          image1: image[0],
          productformData,
        }
      );

      if (productResponse.status === 200) {
        if (image.length > 1) {
          let x = UploadImages();
          if (x) {
            setProductFormData({
              productName: "",
              category: "",
              subBrandName: "",
              price: Number,
              stock: Number,
              discountPrice: Number,
              productDetails: "",
            });
            image1Ref.current.value = "";
            toast.success("Product Updated successfully");
          } else {
            toast.error(
              "Product Updated but unable to upload last two images because of size limit"
            );
          }
        } else {
          toast.success("Product Updated successfully");
          setProductFormData({
            productName: "",
            category: "",
            subBrandName: "",
            price: Number,
            stock: Number,
            discountPrice: Number,
            productDetails: "",
          });
          image1Ref.current.value = "";
        }
      } else {
        toast.error("Product upload failed: " + productResponse.data.message);
      }
    } catch (error) {
      console.error("Error", error);
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