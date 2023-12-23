import axios from "axios";
import { Button } from "@mui/material";
import debounce from "lodash.debounce";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import "./deleteproduct.css";
import Alert from "./alert.png";
import imageDb from "../../../../config";
import axiosClient from "../../../../apisSetup/axiosClient";

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
    axiosClient
      .post("/GetProductToDelete", { productId })
      .then((result) => {
        if (result.data) {
          setProductDetails(result.data);
          openModal();
        } else {
          toast.error("Product not found");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, 500);

  const handleDelete = () => {
    productDetails?.images?.map((item, index)=>{
      const imageRef = ref(imageDb, item);
      deleteObject(imageRef)
        .then(() => {
        })
        .catch((error) => {
          console.error("Error deleting image:", error);
        });
    })

  };


const RemoveProduct = debounce(() => {
  closeModal();
  handleDelete();
  axiosClient
    .post("/DeleteProduct", { productId })
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
