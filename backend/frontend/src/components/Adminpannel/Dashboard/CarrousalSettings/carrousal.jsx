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
  const[showAdd, setShowAdd]=useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:3334/GetCarrousalDetails")
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
      <div className="category-bar" >
        <p onClick={()=>setShowAdd(!showAdd)}>Want to Add New Carrousal Data ? Click here to add</p>
      </div>
      {showAdd && <ChangeCarrousal/>}

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
          <button onClick={() => setIsCallUpdate()}>Delete</button>
        </div>
      </div>
      {/* {isCallUpdate && (
        <ChangeCarrousal key={props.id} objId={props.id} CloseCC={Rerender} />
      )} */}
    </div>
  );
}

function ChangeCarrousal() {
  const {categoryList,CallData} = useContext(CategoryContext);
  const [subcategoryName, setSubCategoryName] = useState("");
  const [carrousalImage, setCarrousalImage] = useState("");
  const [brandName, setBrandName] = useState(categoryList[0]);
  function handleChange(e) {
    setBrandName(e.target.value);
  }
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setCarrousalImage(reader.result);
    };
    reader.onerror = () => {
      console.log("Error ", error);
    };
  }

  // const UpdateCarrousal = debounce(() => {
  //   if (subcategoryName.length === 0 && carrousalImage.length === 0) {
  //     toast.error("Input Required");
  //     return;
  //   }
  //   axios
  //     .post("http://localhost:3334/UpdateCarrousal", {
  //       carrousalImage,
  //       subcategoryName,
  //       objId,
  //       brandName,
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         // Successful response from the backend
  //         if (response.data === "Category does not exist") {
  //           toast.error("This Category does not exist");
  //         } else if (response.data === "Carrousal Product does not exist") {
  //           toast.error("Carrousal Product does not exist");
  //         } else {
  //           props1.CloseCC();
  //           toast.success("Carrousal product updated successfully");
  //         }
  //       } else {
  //         // Handle other response statuses (e.g., 409 for a conflict)
  //         toast.error("Carrousal Failed to Update: " + response.data);
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error("Error", error);
  //     });
  // }, 1000); 

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

      <button onClick={()=>{}}>Change</button>
      <ToastContainer />
    </div>
  );
}
