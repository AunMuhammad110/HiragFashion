import axios from "axios";
import debounce from "lodash.debounce";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import "react-toastify/dist/ReactToastify.css";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import "./deliveryrates.css";
import useBoolean from "../../../Customhooks/boolean";
import axiosClient from "../../../../apisSetup/axiosClient";

export default function DeliverPrice() {
  const [isUpdate, { setToggle: setIsUpdate }] = useBoolean(false);
  const [countryId, setCountryId] = useState("");
  const [isAdd, { setToggle: setIsAdd }] = useBoolean(false);
  const [count, setCount] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState([]);

  useEffect(() => {
    axiosClient
      .get("GetDeliveryDetails")
      .then((result) => {
        setDeliveryDetails(result.data);
      })
      .catch((error) => {
        alert(error);
      });
  }, [count]);
  const CallUpdateCountry = (id) => {
    setCountryId(id);
    setIsUpdate();
  };

  const deleteCountry = debounce((id) => {
    axiosClient
      .delete(`/DeleteCountry/${id}`)
      .then((result) => {
        toast.success("Country deleted successfully");
        // Refresh the data after deletion
        setCount(count + 1);
      })
      .catch((error) => {
        toast.error("Error while deleting country");
      });
  },500);

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

  return (
    <div className="delivery-price-container">
      <h1>Set Delivery Rates</h1>
       <div className="ccategory-bar deliver-cb">
        <p onClick={()=>{setIsAdd();}}>
          Dont find a Category ? Click here to add category
        </p>
      </div>

      {isAdd && <ADDeliveryDetails close={()=>{setIsAdd(); setCount(count+1)}}/>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Country Name</StyledTableCell>
              <StyledTableCell align="">First Kg</StyledTableCell>
              <StyledTableCell align="">Add Kg</StyledTableCell>
              <StyledTableCell align="">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryDetails.map((row) => (
              <StyledTableRow key={row._id} style={{height:'7vh'}}>
                <StyledTableCell component="th" scope="row">
                  {row.countryName}
                </StyledTableCell>
                <StyledTableCell align="">{row.firstKg}</StyledTableCell>
                <StyledTableCell align="">{row.addKg}</StyledTableCell>
                <StyledTableCell align="" >
                  <div className="custom-dropdown">
                    <MoreHorizIcon />
                    <div className="custom-dropdown-content">
                      <button   onClick={() => {
                      deleteCountry(row._id);
                    }}>Delete</button>
                  <button
                    onClick={() => {
                      CallUpdateCountry(row._id);
                    }}
                  >
                    Update
                  </button>
                    </div>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer />
      {isUpdate && (
        <UpdateDeliveryDetails
          id={countryId}
          close={() => {
            setIsUpdate();
            setCountryId("");
            setCount(count + 1);
          }}
        />
      )}
    </div>
  );
}

function UpdateDeliveryDetails(props) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [countryformData, setCountryFormData] = React.useState({
    countryName: "",
    firstKg: Number,
    addKg: Number,
  });
  function handleChange(event) {
    const { name, value } = event.target;
    setCountryFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }
  const UpdateCountry = debounce(async () => {
    try {
      const response = await axiosClient.post(
        `/UpdateCountry/${props.id}`,
        countryformData
      );
  
      if (response.status === 200) {
        // Handle success, e.g., show a success message or perform further actions
        toast.success("Updated Country successfully");
        setCountryFormData({
          countryName: "",
          firstKg: null,
          addKg: null,
        });
        props.close();
        setIsModalOpen(false);

      } else {
        toast.error("Error: ");
      }
    } catch (error) {
      console.error("Error while updating country: ", error.message);
    }
  }, 500);

  

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-container delete-modal-container">
            <h2>Update Country Delivery Details</h2>
        

          <div className="update-delivery-modal">
            <div>
              <input
                type="text"
                name="countryName"
                onChange={handleChange}
                placeholder="Enter Country Name"
                value={countryformData.countryName}
              />
            </div>
            <div>
              <input
                type="text"
                name="firstKg"
                onChange={handleChange}
                value={countryformData.firstKg}
                placeholder="Enter First Kg"
              />
            </div>
            <div>
              <input
                type="text"
                name="addKg"
                onChange={handleChange}
                value={countryformData.addKg}
                placeholder="Enter Add Kg"
              />
            </div>
            <button onClick={UpdateCountry}>Update Country</button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}

function ADDeliveryDetails(props2) {
  const [countryformData, setCountryFormData] = React.useState({
    countryName: "",
    firstKg: Number,
    addKg: Number,
  });
  function handleChange(event) {
    const { name, value } = event.target;
    setCountryFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }
  const AddCountry = debounce(() => {
    axiosClient
      .post("AddDeliveryPrice", {
        country: countryformData.countryName,
        firstKg: countryformData.firstKg,
        addKg: countryformData.addKg,
      })
      .then((result) => {
        if (result.status === 200) {
          if (result.data.message === "Country already exists") {
            toast.error("Country already exists");
            setCountryFormData({ countryName: "", firstKg: 0, addKg: 0 });
            return;
          }
  
          toast.success("data sent successfully to the backend");
          setCountryFormData({ countryName: "", firstKg: 0, addKg: 0 });
          props2.close();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("there was an error");
      });
  }, 500);

  return (
    <div>
      <div className="delivery-AC">
        <div>
          <label htmlFor="">Country Name</label>
          <input
            type="text"
            name="countryName"
            onChange={handleChange}
            value={countryformData.countryName}
            placeholder="Enter country name"
          />
        </div>
        <div>
          <label htmlFor="">First Kg Price: </label>
          <input
            type="text"
            name="firstKg"
            onChange={handleChange}
            value={countryformData.firstKg}
            placeholder="Enter First Kg"
          />
        </div>
        <div>
          <label htmlFor="">Add Kg Price:</label>
          <input
            type="text"
            name="addKg"
            onChange={handleChange}
            value={countryformData.addKg}
            placeholder="Enter Add Kg"
          />
        </div>
        <button onClick={AddCountry}>Add Country</button>
      </div>
      <ToastContainer />
    </div>
  );
}
