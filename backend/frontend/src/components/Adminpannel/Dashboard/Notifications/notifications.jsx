import axios from "axios";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import "./notification.css";
import useBoolean from "../../../Customhooks/boolean";

export default function Notifications() {
  const [count, setCount] = useState(0);
  const [notificationDetails, setNotificationDetails] = useState([]);
  const [showAddProductId, { setToggle: setShowAddProductId }] = useBoolean();
  useEffect(() => {
    axios
      .get("http://localhost:3334/GetProductIds")
      .then((result) => {
        // Uncomment the following line to set the carrousalDetails state
        setNotificationDetails(result.data);
      })
      .catch((error) => {
        toast("Error: " + error.message);
      });
  }, [count]);

  const DeleteProductID = debounce((id) => {
    axios
      .post("http://localhost:3334/DeleteProductId", { productId: id })
      .then((response) => {
        if (response.status === 200) {
          // Product deleted successfully
          toast.success(response.data.message);
          setCount(count + 1);
          // You may want to update the frontend state or UI here if needed
        } else if (response.status === 404) {
          // Product not found
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        toast.error("Error: " + error.message);
      });
  }, 500);

  return (
    <div className="notification-container">
      <h1>Notifications Settings</h1>
      <div className="category-bar" style={{ padding: "2vh" }}>
        <p onClick={() => setShowAddProductId()}>
          Want to add Product ? Click here to add a product
        </p>
      </div>
      {showAddProductId && (
        <NotificationUpdate
          closeNU={() => {
            setShowAddProductId();
            setCount(count + 1);
          }}
        />
      )}
      <div className="notification-card">
      <div>
        <p style={{'fontSize':'20px'}}><strong>Sno</strong></p>
        <p style={{'fontSize':'20px'}}><strong>ProductId</strong></p>
        <p style={{'fontSize':'20px'}}><strong>Product Name</strong></p>
        <p style={{'fontSize':'20px'}}><strong>Product Price</strong></p>
      </div>

          <p style={{'fontSize':'20px'}}><strong>Delete Product </strong></p>

      </div>
      {notificationDetails.length > 0 &&
        notificationDetails.map((notification, index) => (
          <NotificationCard
            sno={index + 1}
            id={notification.productId}
            name={notification.productName}
            price={notification.price}
            onDelete={() => DeleteProductID(notification.productId)}
          />
        ))}
        <ToastContainer/>
      {/* <NotificationUpdate/> */}
    </div>
  );
}

function NotificationCard(props) {
  return (
    <div className="notification-card">
      <div>
        <p>{props.sno}</p>
        <p>{props.id}</p>
        <p>{props.name}</p>
        <p>{props.price}</p>
      </div>
      <p style={{'marginRight':'3.5vw'}} onClick={props.onDelete} ><DeleteOutlineOutlinedIcon/></p>
    </div>
  );
}

function NotificationUpdate(props2) {
  const [changeProductId, setChangeProductId] = useState("");

  const UpdateNotification = debounce(() => {
    if (changeProductId.length === 0) {
      alert("Input Required");
      return;
    }
    axios
      .post("http://localhost:3334/AddNotification", {
        changeProductId: changeProductId,
      })
      .then((response) => {
        if (response.status === 201) {
          // Successful response from the backend
          if (response.data.error === "Product ID already exists") {
            toast.error("Product ID already exists");
          } else {
            // Product added successfully
            toast.success("Product added successfully");
            props2.closeNU();
            console.log(response.data);
          }
        } else {
          toast.error("Product Failed to Update: " + response.data.error);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Error: " + error.message);
        }
      });
  }, 500); 

  return (
    <div className="notification-update-container">
      <input
        type="text"
        placeholder="Enter Product Id"
        onChange={(event) => setChangeProductId(event.target.value)}
        value={changeProductId}
      />
      <button onClick={UpdateNotification}>Add Product</button>
      <ToastContainer />
    </div>
  );
}
