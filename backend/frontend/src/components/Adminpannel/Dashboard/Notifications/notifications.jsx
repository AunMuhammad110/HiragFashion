import axios from "axios";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import "react-toastify/dist/ReactToastify.css";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import noDataImage from "../../../../assets/nodata.jpg"

import "./notification.css";
import useBoolean from "../../../Customhooks/boolean";
import axiosClient from "../../../../apisSetup/axiosClient";

export default function Notifications() {
  const [count, setCount] = useState(0);
  const [notificationDetails, setNotificationDetails] = useState([]);
  const [showAddProductId, { setToggle: setShowAddProductId }] = useBoolean();
  useEffect(() => {
    axiosClient
      .get("/GetProductIds")
      .then((result) => {
        setNotificationDetails(result.data);
      })
      .catch((error) => {
        toast("Error: " + error.message);
      });
  }, [count]);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const DeleteProductID = debounce((id) => {
    axiosClient
      .post("/DeleteProductId", { productId: id })
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
      <div className="ccategory-bar">
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
        {notificationDetails.length===0 && (
        <div className="wrapper">
          <div className="display-flex-col no-data-container">
            <img src={noDataImage} alt="no data image here" />
            <h5>No Data Found</h5>
          </div>
        </div>
      )}
       <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            {notificationDetails.length > 0  &&
                      <TableHead>
                      <TableRow>
                        <StyledTableCell align="">Product Id</StyledTableCell>
                        <StyledTableCell align="">Product Title</StyledTableCell>
                        <StyledTableCell align="">Product Price</StyledTableCell>
                        <StyledTableCell align="">Delete Product</StyledTableCell>
                      </TableRow>
                    </TableHead>}
          <TableBody>

          {notificationDetails.length > 0 &&
        notificationDetails.map((notification, index) => (
          <StyledTableRow key={index} style={{height:'7vh'}}>
          <StyledTableCell component="th" scope="row">
            {notification.productId}
          </StyledTableCell>
          <StyledTableCell align="">{notification.productName}</StyledTableCell>
          <StyledTableCell align="">{notification.price}</StyledTableCell>
          <StyledTableCell style={{paddingLeft:"3vw"}} onClick={()=>DeleteProductID(notification.productId)} ><DeleteOutlineOutlinedIcon/></StyledTableCell>
            </StyledTableRow>
        ))} 
          </TableBody>
        </Table>
      </TableContainer>
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
    axiosClient
      .post("/AddNotification", {
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
