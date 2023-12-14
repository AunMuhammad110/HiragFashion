import axios from "axios";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";

import "./carrousal.css";
import CategoryContext from "../Product/details";
import useBoolean from "../../../Customhooks/boolean";
import axiosClient from "../../../../apisSetup/axiosClient";


export default function CarrousalSettings() {
  const [count, setCount] = useState(0);
  const [carrousalDetails, setCarrousalDetails] = useState([]);
  const[showAdd, setShowAdd]=useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const handleAddClick = () => {
    if (carrousalDetails.length===3) {
      setDisableClick(true);
      toast.error("Cannot add new Carrousal data. Maximum limit reached.");
    } else {
      // setDisableClick(false);
      setShowAdd(!showAdd);
    }
  };

  useEffect(() => {
    axiosClient
      .get("/GetCarrousalDetails")
      .then((result) => {
        setCarrousalDetails(result.data);
      })
      .catch((error) => {
        toast("Error: " + error.message);
      });
  }, [count]);
  return (
    <div className="carrousal-settings-container">
      <h1>Carrousal Settings</h1>
      <div className="category-bar">
        <p onClick={handleAddClick} style={{ cursor: disableClick ? "not-allowed" : "pointer" }}>
          Want to Add New Carrousal Data ? Click here to add
        </p>
      </div>
      {showAdd && <ChangeCarrousal _render={() => setCount(count + 1)} closeForm={()=>setShowAdd(false)}/>}

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
  function DeleteCarrousal(){
    axiosClient
    .post("/DeleteCarrousal", {
      id:props.id,
    })
    .then((response) => {
      toast.success("Carrousal Data deleted successfully")
      props._render();
    })
    .catch((error) => {
      toast.error("Error while deleting carrousal")
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

function ChangeCarrousal({_render,closeForm}) {
  const {categoryList,CallData} = useContext(CategoryContext);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [subcategoryName, setSubCategoryName] = useState("");
  const [carrousalImage, setCarrousalImage] = useState("");
  const [brandName, setBrandName] = useState(categoryList[0]);
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
  },[brandName])

  function convertToBase64(e) {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
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
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.9); // Adjust quality (0.9 is just an example)
        setCarrousalImage(compressedBase64);
      };
    };

    reader.onerror = () => {
      toast.error("Error ", error);
    };
  }


  const AddCarrousal = debounce(() => {
    if (subcategoryName.length === 0 && carrousalImage.length === 0) {
      toast.error("Input Required");
      return;
    }
    axiosClient
      .post("/CreateCarrousal", {
        carrousalImage,
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
        <select onChange={handleChange} value={brandName} required className="custom-select">
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select onChange={(e)=> setSubCategoryName(e.target.value)} value={subcategoryName} required className="custom-select">
          {subCategoryList?.map((category, index) => (
            <option key={index} value={category.subBrandName}>
              {category.subBrandName}
            </option>
          ))}
        </select>
      </div>
      <input type="file" onChange={convertToBase64} accept="image/*" required />

      <button onClick={AddCarrousal}>Add</button>
      <ToastContainer />
    </div>
  );
}
