import axios from "axios";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useContext, useEffect, useState } from "react";

import "./carrousal.css";
import CategoryContext from "../Product/details";
import useBoolean from "../../../Customhooks/boolean";


export default function CarrousalSettings() {
  const [count, setCount] = useState(0);
  const [carrousalDetails, setCarrousalDetails] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3334/GetCarrousalDetails")
      .then((result) => {
        // Uncomment the following line to set the carrousalDetails state
        setCarrousalDetails(result.data);
      })
      .catch((error) => {
        toast("Error: " + error.message);
      });
  }, [count]);
  return (
    <div className="carrousal-settings-container">
      <h1>Carrousal Settings</h1>
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
  const [isCallUpdate, { setToggle: setIsCallUpdate }] = useBoolean();
  function Rerender() {
    setIsCallUpdate();
    props._render();
  }
  return (
    <div>
      <div className="carrousal-card-container">
        <h2>{props._brand}</h2>
        <h5 style={{ marginBottom: "1vh" }}>( {props._category} )</h5>

        <div>
          <img src={props.image} alt="carrousal image" />
          <button onClick={() => setIsCallUpdate()}>Update</button>
        </div>
      </div>
      {isCallUpdate && (
        <ChangeCarrousal key={props.id} objId={props.id} CloseCC={Rerender} />
      )}
    </div>
  );
}

function ChangeCarrousal(props1) {
  const {categoryList,CallData} = useContext(CategoryContext);
  const [subcategoryName, setSubCategoryName] = useState("");
  const [carrousalImage, setCarrousalImage] = useState("");
  const [objId, setObjId] = useState(props1.objId);
  const [brandName, setBrandName] = useState(categoryList[0]);
  function handleChange(e) {
    setBrandName(e.target.value);
  }
  function convertToBase64(e) {
    alert("this runs only");
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setCarrousalImage(reader.result);
    };
    reader.onerror = () => {
      console.log("Error ", error);
    };
    console.log(carrousalImage);
  }

  const UpdateCarrousal = debounce(() => {
    if (subcategoryName.length === 0 && carrousalImage.length === 0) {
      toast.error("Input Required");
      return;
    }
    axios
      .post("http://localhost:3334/UpdateCarrousal", {
        carrousalImage,
        subcategoryName,
        objId,
        brandName,
      })
      .then((response) => {
        if (response.status === 200) {
          // Successful response from the backend
          if (response.data === "Category does not exist") {
            toast.error("This Category does not exist");
          } else if (response.data === "Carrousal Product does not exist") {
            toast.error("Carrousal Product does not exist");
          } else {
            props1.CloseCC();
            toast.success("Carrousal product updated successfully");
            console.log(response.data);
          }
        } else {
          // Handle other response statuses (e.g., 409 for a conflict)
          toast.error("Carrousal Failed to Update: " + response.data);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        toast.error("Error", error);
      });
  }, 1000); 

  return (
    <div className="change-carrousal-container">
      <div>
        <select onChange={handleChange} value={brandName} required>
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        onChange={(event) => setSubCategoryName(event.target.value)}
        value={subcategoryName}
        placeholder="Enter Sub Category Name"
        required
      />
      <input type="file" onChange={convertToBase64} accept="image/*" required />

      <button onClick={UpdateCarrousal}>Change</button>
      <ToastContainer />
    </div>
  );
}
