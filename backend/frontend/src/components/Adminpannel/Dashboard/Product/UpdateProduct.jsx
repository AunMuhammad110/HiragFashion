import { v4 } from "uuid";
import { nanoid } from "nanoid";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import "./updateproduct.css";
import CategoryContext from "./details";
import imageDb from "../../../../config";
import useBoolean from "../../../Customhooks/boolean";
import axiosClient from "../../../../apisSetup/axiosClient";

const UpdateProduct = React.memo(() => {
  const { categoryList, CallData } = useContext(CategoryContext);
  const [displayCategory, setDisplayCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const imageUrl = useRef("");
  const [showImageInputs, { setToggle: setShowImageInputs }] =
    useBoolean(false);
  const [image, setImage] = useState([]);
  const [productId, setProductId] = useState("");
  const [rawImages, setRawImages] = useState([]);

  const handleImage = (productImage) => {
    return new Promise((resolve, reject) => {
      const imageRef = ref(imageDb, `files/${v4()}`);
      const uploadTask = uploadBytes(imageRef, productImage);

      uploadTask
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              imageUrl.current = url;
              resolve();
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              reject(error);
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          reject(error);
        });
    });
  };

  const handleDelete = () => {
    image.map((item, index) => {
      const imageRef = ref(imageDb, item);
      deleteObject(imageRef)
        .then(() => {})
        .catch((error) => {
          console.error("Error deleting image:", error);
        });
    });
  };

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
      .then((response) => {})
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
    handleDelete();
    setImage([]);
    setDisplayCategory(false);
    setShowImageInputs();
  }

  const AddProduct = async () => {
    let imageArray = [];
    // e.preventDefault();
    setIsLoading(true);
    if (!productformData.category || !productformData.subBrandName) {
      toast.error("Please fill the required inputs");
      return;
    }
    try {
      await Promise.all(
        rawImages.map(async (item) => {
          await handleImage(item);
          imageArray.push(imageUrl.current);
        })
      );
      let productId = nanoid(8);

      const productResponse = await axiosClient.post("/UploadProduct", {
        image: imageArray,
        productformData,
        productId,
      });

      if (productResponse.status === 200) {
        setProductFormData({
          productName: "",
          category: "",
          subBrandName: "",
          price: 0,
          stock: 0,
          discountPrice: 0,
          productDetails: "",
          productWeight: 0,
        });
        image1Ref.current.value = "";
        image2Ref.current.value = "";
        image3Ref.current.value = "";
        imageUrl.current = "";
        setRawImages([]);
        imageArray = [];
        toast.success("Product Updated successfully");
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Failed to upload the product or images.");
    } finally {
      setIsLoading(false);
    }
  };

  function Handler() {
    RemoveProduct();
    AddProduct();
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
                onChange={(e) =>
                  setRawImages([...rawImages, e.target.files[0]])
                }
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
                onChange={(e) =>
                  setRawImages([...rawImages, e.target.files[0]])
                }
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
                onChange={(e) =>
                  setRawImages([...rawImages, e.target.files[0]])
                }
                name="image3"
                accept="image/*"
                id="image3"
                ref={image3Ref}
              />
            </div>
          </>
        )}

        <button
          class="custom-button"
          type="submit"
          disabled={isLoading}
          style={{ width: "20vw" }}
          onClick={Handler}
        >
          {isLoading ? (
            <div>
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              &nbsp; Updating Product
            </div>
          ) : (
            "Update Product"
          )}
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
            <button
              onClick={RemoveImages}
              className={isLoading ? "not-allowed" : ""}
              disabled={isLoading}
            >
              Delete Images
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
});
export default UpdateProduct;
