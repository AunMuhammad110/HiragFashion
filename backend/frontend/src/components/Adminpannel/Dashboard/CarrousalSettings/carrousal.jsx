import { v4 } from "uuid";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import "./carrousal.css";
import imageDb from "../../../../config";
import CategoryContext from "../Product/details";
import axiosClient from "../../../../apisSetup/axiosClient";

export default function CarrousalSettings() {
  const [count, setCount] = useState(0);
  const [carrousalDetails, setCarrousalDetails] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const handleAddClick = () => {
    if (carrousalDetails.length === 3) {
      setDisableClick(true);
      toast.error("Cannot add new Carrousal data. Maximum limit reached.");
    } else {
      setShowAdd(!showAdd);
    }
  };

  useEffect(() => {
    axiosClient
      .get("/GetCarrousalDetails")
      .then((result) => {
        setCarrousalDetails(result.data);
        if (result.data.length < 3) setDisableClick(false);
      })
      .catch((error) => {
        toast("Error: " + error.message);
      });
  }, [count]);

  return (
    <div className="carrousal-settings-container">
      <h1>Carrousal Settings</h1>
      <div className="category-bar">
        <p
          onClick={handleAddClick}
          style={{ cursor: disableClick ? "not-allowed" : "pointer" }}
        >
          Want to Add New Carrousal Data ? Click here to add
        </p>
      </div>
      {showAdd && (
        <ChangeCarrousal
          _render={() => setCount(count + 1)}
          closeForm={() => setShowAdd(false)}
        />
      )}

      {carrousalDetails.length > 0 &&
        carrousalDetails.map((item) => (
          <CarrousalCard
            id={item._id}
            key={item._id}
            image={item.image}
            _category={item.subCategoryName}
            _brand={item.brandName}
            _render={() => setCount(count + 1)}
          />
        ))}
      <ToastContainer />
    </div>
  );
}

function CarrousalCard(props) {
  const handleDelete = () => {
    const imageRef = ref(imageDb, props.image);
    deleteObject(imageRef)
      .then(() => {})
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  function DeleteCarrousal() {
    handleDelete();
    axiosClient
      .post("/DeleteCarrousal", {
        id: props.id,
      })
      .then((response) => {
        toast.success("Carrousal Data deleted successfully");
        props._render();
      })
      .catch((error) => {
        toast.error("Error while deleting carrousal");
      });
  }

  return (
    <div>
      <div className="carrousal-card-container">
        <h2>{props._brand}</h2>
        <h5 style={{ marginBottom: "1vh" }}>( {props._category} )</h5>

        <div>
          <img src={props.image} alt="carrousal image" />
          <button onClick={DeleteCarrousal}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ChangeCarrousal({ _render, closeForm }) {
  const { categoryList, CallData } = useContext(CategoryContext);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [subcategoryName, setSubCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  function handleChange(e) {
    setBrandName(e.target.value);
  }

  useEffect(() => {
    axiosClient
      .post("/GetSubCategoryList", {
        brandName: brandName ? brandName : categoryList[0],
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

  const handleImage = (carrousalImage) => {
    const imageRef = ref(imageDb, `files/${v4()}`);
    setIsLoading(true);
    const uploadTask = uploadBytes(imageRef, carrousalImage);
    uploadTask
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setIsLoading(false);
            setImageUrl(url);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const AddCarrousal = debounce(() => {
    if (
      subcategoryName.length === 0 ||
      imageUrl.length === 0 ||
      brandName.length === 0
    ) {
      toast.error("Fill the input");
      return;
    }
    axiosClient
      .post("/CreateCarrousal", {
        imageUrl,
        subcategoryName,
        brandName,
      })
      .then((response) => {
        toast.success("Carrousal created successfully");
        _render();
        closeForm();
      })
      .catch((error) => {
        toast.error("Error", error);
      });
  }, 1000);

  return (
    <div className="change-carrousal-container">
      <div>
        <select
          onChange={handleChange}
          value={brandName}
          required
          className="custom-select"
        >
          <option value="">Select Brand</option>
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          onChange={(e) => setSubCategoryName(e.target.value)}
          value={subcategoryName}
          required
          className="custom-select"
        >
        <option value="">Select Brand Category</option>
          {subCategoryList?.map((category, index) => (
            <option key={index} value={category.subBrandName}>
              {category.subBrandName}
            </option>
          ))}
        </select>
      </div>
      <input
        type="file"
        onChange={(e) => {
          handleImage(e.target.files[0]);
        }}
        accept="image/*"
        required
      />
      <button
        onClick={AddCarrousal}
        className={isLoading ? "disable-add-button" : "add-button"}
        disabled={isLoading}
      >
        Add
      </button>
      <ToastContainer />
    </div>
  );
}
