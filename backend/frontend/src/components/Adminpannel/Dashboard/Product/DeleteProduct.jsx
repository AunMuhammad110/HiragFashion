import axios from "axios";
import { Button } from "@mui/material";
import debounce from "lodash.debounce";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import "./deleteproduct.css";
import Alert from "./alert.png";

export default function DeleteProduct() {
  const [productId, setProductId] = useState("");
  const [productDetails, setProductDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const GetProduct = debounce(() => {
    // Replace with the actual product ID
    if (productId.length < 0) {
      alert("Please enter a product ID");
      return;
    }
    axios
      .post("http://localhost:3334/GetProductToDelete", { productId })
      .then((result) => {
        if (result.data) {
          // If the product is found, update your state or UI with the product details
          setProductDetails(result.data);
          openModal();
        } else {
          // If the product is not found, display an alert
          toast.error("Product not found");
        }
      })
      .catch((error) => {
        // If there's an error, display an alert with the error message
        console.log(error.message);
      });
  }, 500);


const RemoveProduct = debounce(() => {
  closeModal();
  axios
    .post("http://localhost:3334/DeleteProduct", { productId })
    .then((response) => {
      if (response.status === 200 ) {
        toast.success("Product deleted successfully");
        setProductId("");
      } 
    })
    .catch((error) => {
      toast.error("Product not found");
      console.log("Server error: " + error.message);
    });
}, 500); 
  return (
    
    <div className="delete-product-container">
      <h1>Delete Product </h1>
      <div>
        <input
          type="text"
          onChange={() => setProductId(event.target.value)}
          value={productId}
          placeholder="Enter Product Id "
          required
        />
        <button onClick={GetProduct}> Get Product</button>
      </div>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-container delete-modal-container">
          {/* Add the modal-container class */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "2vh",
            }}
          >
            <img
              src={Alert}
              style={{ width: "50px", "margin-right": "1vw" }}
              alt="image  is here"
            />
            <h2>Remove Category</h2>
          </div>

          <p>
            The product name is <strong>{productDetails.productTitle}</strong>{" "}
            and the price is <strong>{productDetails.productPrice}</strong>. If you
            press yes, then the product will be removed.
          </p>

          <Button variant="contained" onClick={RemoveProduct}>
            Yes
          </Button>
          <Button variant="contained" onClick={closeModal}>
            No
          </Button>
        </div>
      </Modal>
      <ToastContainer/>
    </div>
  );
}
