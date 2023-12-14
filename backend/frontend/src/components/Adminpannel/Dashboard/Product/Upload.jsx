import axios from "axios";
import debounce from "lodash.debounce";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import useBoolean from "../../../Customhooks/boolean";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect, useRef, useContext } from "react";

import "./upload.css";
import CategoryContext from "./details";

export default function UploadProduct() {
  const { categoryList, CallData } = useContext(CategoryContext);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [isToggle, { setToggle }] = useBoolean();
  const image1Ref = useRef();
  const image2Ref = useRef();
  const image3Ref = useRef();
  const [productformData, setProductFormData] = React.useState({
    productName: "",
    category: "",
    subBrandName: "",
    price: Number,
    stock: Number,
    discountPrice: Number,
    productDetails: "",
  });
  const [image, setImage] = useState([]);
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage([...image, reader.result]);
    };
    reader.onerror = () => {
      toast.error("Error ", error);
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
  const AddProduct = async (e) => {
    e.preventDefault();

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
            toast.success("Product Uploaded successfully");
          } else {
            toast.error(
              "Product Uploaded but unable to upload last two images because of size limit"
            );
          }
        } else {
          toast.success("Product Uploaded successfully");
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

  useEffect(() => {
    axios
      .post("http://localhost:3334/GetSubCategoryList", {
        brandName: productformData.category,
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
  }, [productformData.category]);
  //   get data of categories in database

  return (
    <div className="upload-product-container">
      <h1>Upload Product to the Hira G fashion Website</h1>
      <Category CallCategories={setToggle} />
      <form className="product-form" onSubmit={AddProduct}>
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
          <label htmlFor="category">Select Brand Name</label>
          <select
            name="category"
            onChange={handleChange}
            value={productformData.category}
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

        <input className="product-upload-button" type="submit" />
      </form>
      <ToastContainer />
    </div>
  );
}

function Category(props) {
  const [showCategoryForm, { setToggle: setShowCategoryForm }] = 
  useBoolean(false);
  const [showUpdateCategory, { setToggle: setShowUpdateCategory }] =
    useBoolean(false);
  const [showRemoveCategory, { setToggle: setShowRemoveCategory }] =
    useBoolean(false);
  const [showSubBrandForm, { setToggle: setShowSubBrandForm }] =
    useBoolean(false);
  const { register, handleSubmit, reset } = useForm();
  const { categoryList, CallData } = useContext(CategoryContext);

  const AddCategory = debounce((data) => {
    axios
      .post("http://localhost:3334/AddCategory", {
        brandName: data.brandName,
      })
      .then((response) => {
        if (response.status === 201) {
          // Document added successfully
          toast.success(response.data.message);
          reset();
        }
      })
      .catch((error) => {
        // Handle errors from the server
        console.log(error);
        if (error.response.status === 409) {
          toast.error(error.response.data.error);
        }
      });
    CallData();
  }, 500);

  return (
    <>
      <div className="category-bar">
        <p onClick={setShowCategoryForm}>
          Dont find a Category ? Click here to add category
        </p>
        <div>
          <button className="custom-button" onClick={setShowRemoveCategory}>
            Remove Category{" "}
          </button>
          <button className="custom-button" onClick={setShowUpdateCategory}>
            Update Category{" "}
          </button>
        </div>
      </div>
      {showCategoryForm && (
        <div className="category-main-container">
          <form className="category-form" onSubmit={handleSubmit(AddCategory)}>
            <div className="category-container">
              <label>Brand Name</label>
              <br />
              <input
                type="text"
                placeholder="Enter Category Name"
                {...register("brandName")}
                required
              />
              <button>Add</button>
            </div>
          </form>

          <p onClick={setShowSubBrandForm} style={{ cursor: "pointer" }}>
            Click here to Add sub category
          </p>
          {showSubBrandForm && (
            <SubBrandForm CloseSubBrand={setShowSubBrandForm} />
          )}
        </div>
      )}
      {showRemoveCategory && (
        <RemoveCategory
          ReRenderComponent={props.CallCategories}
          CloseRemoveCategory={setShowRemoveCategory}
        />
      )}
      {showUpdateCategory && (
        <UpdateCategory
          ReRenderComponent={props.CallCategories}
          CloseUpdateCategory={setShowUpdateCategory}
        />
      )}
      <ToastContainer />
    </>
  );
}

function SubBrandForm(addprops) {
  const { categoryList, CallData } = useContext(CategoryContext);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      collections: [],
    },
  });
  const AddSubBrand = debounce((data, e) => {
    e.preventDefault();
    if (data.collections.length < 1) {
      alert("Selection of any checkbox is mandatory");
      return;
    }
    axios
      .post("http://localhost:3334/AddSubBrand", {
        data,
      })
      .then((response) => {
        if (response.status === 201) {
          // Document added successfully
          toast.success(response.data.message);
          addprops.CloseSubBrand();
          reset();
        }
      })
      .catch((error) => {
        // Handle errors from the server
        console.log(error);
        if (error.response.status === 409) {
          toast.error(error.response.data.error);
        }
      });
  }, 500);

  return (
    <div className="update-sub-category">
      <hr />
      <form onSubmit={handleSubmit(AddSubBrand)} className="">
        <label htmlFor="category" className="input-label">
          Select Brand Name
        </label>
        <br />
        <select {...register("brandName")} required>
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <br />
        <label className="input-label">Brand Category Name</label>
        <br />
        <input
          type="text"
          placeholder="Enter Category Name"
          {...register("subBrandName")}
          require
        />
        <div className="categoy-checkboxes">
          <div>
            <input
              type="checkbox"
              name="weddingCollection"
              value="Wedding Collection"
              {...register("collections")}
            />
            <label htmlFor="weddingCollection"> Wedding Collection</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="New Collection"
              {...register("collections")}
            />
            <label> New Collection</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Summer Collectuin"
              {...register("collections")}
            />
            <label> Summer Collection</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Winter Collectuin"
              {...register("collections")}
            />
            <label> Winter Collection</label>
          </div>
          <div>
            <input type="checkbox" value="Sale" {...register("collections")} />
            <label> Sale</label>
          </div>
        </div>
        <br />
        <button>Add</button>
      </form>
      <br />
      <br />
      <ToastContainer />
    </div>
  );
}

function UpdateCategory(props) {
  const { categoryList, CallData } = useContext(CategoryContext);
  const [updateFormData, setUpdateFormData] = React.useState({
    previousCategoryName: "",
    newCategoryName: "",
  });
  const [showCategoryUpdateForm, { setToggle: setShowCategoryUpdateform }] =
    useBoolean();

  function handleChange(event) {
    const { name, value } = event.target;
    setUpdateFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  const UpdateCategory = debounce((e) => {
    if (
      updateFormData.previousCategoryName.length < 1 &&
      updateFormData.newCategoryName.length < 1
    ) {
      toast.error("Please fill the inputs");
      return;
    }
    e.preventDefault();
    axios
      .post("http://localhost:3334/UpdateCategory", {
        previousCategoryName: updateFormData.previousCategoryName,
        newCategoryName: updateFormData.newCategoryName,
      })
      .then((response) => {
        // Category updated successfully
        props.ReRenderComponent();
        toast.success("Brand Name Updated!");
        props.CloseUpdateCategory();
      })
      .catch((error) => {
        // Handle errors from the server
        if (error.response) {
          toast.error("Error while updating category: " + error.response.data);
        } else {
          toast.error("An error occurred while making the request.");
        }
        console.log(error);
      });
    CallData();
  }, 500);

  return (
    <div className="update-category-container">
      <label style={{ "margin-left": "0vw" }} className="input-label">
        Previous Name
      </label>
      <br />
      <input
        type="text"
        placeholder="Enter Previous Name"
        name="previousCategoryName"
        value={updateFormData.previousCategoryName}
        onChange={handleChange}
        required
      />
      <br />
      <label style={{ "margin-left": "0vw" }} className="input-label">
        New Name
      </label>
      <br />
      <input
        type="text"
        placeholder="Enter New Name"
        name="newCategoryName"
        value={updateFormData.newCategoryName}
        onChange={handleChange}
        required
      />
      <br />
      <button onClick={UpdateCategory}>Change Name</button>
      <ToastContainer />
      <p onClick={setShowCategoryUpdateform} style={{ cursor: "pointer" }}>
        Want to Edit Sub Category ?
      </p>
      {showCategoryUpdateForm && (
        <UpdateSubCategory
          CLoseSubUpadte={() => {
            setShowCategoryUpdateform();
          }}
        />
      )}
    </div>
  );
}

function UpdateSubCategory(updateprops) {
  const { categoryList, CallData } = useContext(CategoryContext);
  const [brandName, setBrandName] = useState(categoryList[0]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [prevSubBrandName, setPrevSubBrandName] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      collections: ["Wedding Collection"],
      subBrandName: "",
    },
  });

  const [next, setNext] = useState(0);

  useEffect(() => {
    axios
      .post("http://localhost:3334/GetSubCategoryList", {
        brandName,
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
  }, [brandName]);

  const UpdataSubBrand = debounce((data, e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3334/UpdateSubCategoryList", {
        data,
        brandName,
        prevSubBrandName,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          updateprops.CLoseSubUpadte();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, 500);

  function handleChange(e) {
    setBrandName(e.target.value);
  }

  useEffect(() => {
    if (subCategoryList.length > 0) {
      if (next < subCategoryList.length) {
        setPrevSubBrandName(subCategoryList[next].subBrandName);
        setValue("subBrandName", subCategoryList[next].subBrandName);
        setValue("collections", subCategoryList[next].collections);
      } else if (next === subCategoryList.length) {
        setNext(0);
      }
      // You may want to handle collections separately here as well
    }
  }, [subCategoryList, next]);
  return (
    <div className="update-sub-category">
      <hr />
      <form onSubmit={handleSubmit(UpdataSubBrand)}>
        <label htmlFor="category" className="input-label">
          Select Brand Name
        </label>
        <br />
        <select onChange={handleChange} value={brandName}>
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <br />
        <label className="input-label">Brand Category Name</label>
        <br />
        <input
          type="text"
          placeholder="Enter Category Name"
          {...register("subBrandName")}
          require
        />
        <div className="categoy-checkboxes">
          <div>
            <input
              type="checkbox"
              name="weddingCollection"
              value="Wedding Collection"
              {...register("collections")}
            />
            <label htmlFor="weddingCollection"> Wedding Collection</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="New Collection"
              {...register("collections")}
            />
            <label> New Collection</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Summer Collectuin"
              {...register("collections")}
            />
            <label> Summer Collection</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="Winter Collectuin"
              {...register("collections")}
            />
            <label> Winter Collection</label>
          </div>
          <div>
            <input type="checkbox" value="Sale" {...register("collections")} />
            <label> Sale</label>
          </div>
        </div>

        <button>Update Sub Brand</button>
      </form>
      <button
        onClick={() => setNext(next + 1)}
        className="admin-button"
        style={{ width: "5vw", marginLeft: "16vw" }}
      >
        next
      </button>
      <ToastContainer />
    </div>
  );
}

function RemoveCategory(props) {
  const { categoryList, CallData } = useContext(CategoryContext);
  const [categoryName, setCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRemoveSubCategory, { setToggle: setShowRemoveCategory }] =
    useBoolean();

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const Remove_Category = debounce(() => {
    closeModal();
    axios
      .post("http://localhost:3334/RemoveCategory", {
        categoryName: categoryName, // Update the property name to match the backend API
      })
      .then((response) => {
        // Category successfully removed
        toast.success(response.data);
        props.ReRenderComponent();
        props.CloseRemoveCategory();
      })
      .catch((error) => {
        // Handle errors from the server
        toast.error("Error while deleting Brand Name: " + error.response.data);
      });
    CallData();
  }, 500);

  return (
    <div className="remove-category-container">
      <label className="input-label">Brand Name</label>
      <br />
      <input
        type="text"
        placeholder="Enter Brand Name"
        value={categoryName}
        s
        onChange={(e) => setCategoryName(e.target.value)}
        required
      />
      <Button onClick={openModal}>remove</Button>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-container">
          {" "}
          {/* Add the modal-container class */}
          <h2>Remove Category</h2>
          <p>
            Are you sure you want to remove the category? because removing
            category will remove all the products belong to this category.
          </p>
          <Button variant="contained" onClick={Remove_Category}>
            Yes
          </Button>
          <Button variant="contained" onClick={closeModal}>
            No
          </Button>
        </div>
      </Modal>
      <ToastContainer />
      <p onClick={setShowRemoveCategory} style={{ cursor: "pointer" }}>
        Click here to remove Sub Category
      </p>
      {showRemoveSubCategory && (
        <RemoveSubCategory CloseSubRemover={() => setShowRemoveCategory()} />
      )}
    </div>
  );
}

function RemoveSubCategory(removeprops) {
  const { categoryList, CallData } = useContext(CategoryContext);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [brandName, setBrandName] = useState(categoryList[0]);
  const [subBrandName, setSubBrandName] = useState("");
  const [next, setNext] = useState(0);

  function handleChange(e) {
    setBrandName(e.target.value);
  }

  useEffect(() => {
    axios
      .post("http://localhost:3334/GetSubCategoryList", {
        brandName,
      })
      .then((response) => {
        if (response.status === 200) {
          setSubCategoryList(response.data.subCategory);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [brandName]);

  useEffect(() => {
    if (subCategoryList.length > 0) {
      console.log("it changed ");
      setSubBrandName(subCategoryList[0].subBrandName);
    }
  }, [subCategoryList]);

  const Remove = debounce(() => {
    console.log(brandName + " removed from " + subBrandName);
    axios
      .post("http://localhost:3334/RemoveSubCategory", {
        brandName,
        subBrandName,
      })
      .then((response) => {
        toast.success(response.data);
        removeprops.CloseSubRemover();
      })
      .catch((error) => {
        console.log(error);
      });
  }, 500);
  useEffect(() => {
    if (subCategoryList.length > 0) {
      if (next < subCategoryList.length) {
        setSubBrandName(subCategoryList[next].subBrandName);
      } else if (next === subCategoryList.length) {
        setNext(0);
      }
      // You may want to handle collections separately here as well
    } else {
      setSubBrandName("");
    }
  }, [subCategoryList, next]);

  return (
    <div className="sub-category-remove">
      <hr />
      <br />
      <div>
        <label htmlFor="category" className="input-label">
          Select Brand Name
        </label>
        <select onChange={handleChange} value={brandName} required>
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <br />
      <br />
      <label htmlFor="category" className="input-label">
        Sub Brand Name
      </label>
      <input type="text" value={subBrandName} readOnly />
      <br />
      <div className="buttons-sub-remove">
        <button onClick={Remove}>Remove Sub Category</button>
        <button onClick={() => setNext(next + 1)} style={{ width: "5vw" }}>
          Next
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
