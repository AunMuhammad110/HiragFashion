import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import debounce from "lodash.debounce";
import { Button } from "@mui/material";
// import ColorChangingButton from './btn';
import './order.css';
import Modal from "@mui/material/Modal";
import '../Product/DeleteProduct.css'
import Alert from "../Product/alert.png";
import Information from './OrderInfo';
// import {useMyContext} from './OrderContext';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [data, setData] = useState([])
    const [count, setCount] = useState(0);
    // const {setDataForSecondComponent } = useMyContext();
    const [OrderInfo, setOrderInfo] = useState([]);
    //this function is for OrderInfo opening and make useContext hook
    const toggleModal = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3334/getorderbyid/${id}`);
            // setDataForSecondComponent(response.data);
            setOrderInfo(response.data)
            // alert(response.data.map((item)=>{item.orderId}))
            setIsModalOpen2(!isModalOpen2)
        } catch (error) {
            alert(error);
        }
    }
    const handleClose = () => {
        // toast.success('Modal is closed')
        setIsModalOpen2(false);
    };
    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }
    const handleIncrement = () => {
        setCount(count + 1);
    };
    useEffect(() => {
        // Make a GET request to fetch the data
        axios.get('http://localhost:3334/getOrder')
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [count]);
    
    const handleDeleteDialog = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3334/getorderbyid/${id}`);
            setData(response.data);
            openModal();
        } catch (error) {
            alert(error);
            alert("Error deleting user");
        }
    }

    const deleteEntry = (orderId) => {
        closeModal();
        axios
            .post("http://localhost:3334/DeleteOrder", { orderId })
            .then((response) => {
                if (response.status === 200) {
                    handleIncrement();
                    toast.success("order deleted successfully");
                    setProductId("");

                }
            })
            .catch((error) => {
                toast.error("Product not found");
                console.log("Server error: " + error.message);
            });
    };

    return (
        <div className='asterik'>
            <div className='simran'>
                <div className="table">
                    <div className="table__header">
                        {/* <h1>{datatoSend}</h1> */}
                    </div>
                    <div className="table__body">
                        <table>
                            <thead>
                                <tr>
                                    <th> Order Id </th>
                                    <th> Client Name</th>
                                    <th> Number of Product</th>
                                    <th> Location/Country</th>
                                    <th> Attachments</th>
                                    <th> Status </th>
                                    <th> Delete </th>
                                </tr>
                            </thead>
                            <tbody className='t-body'>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.orderId}</td>
                                        <td>{order.clientFName} {order.clientLName}</td>
                                        <td>{order.NoProduct}</td>
                                        <td>{order.Location}</td>
                                        <td><button className="button-61" onClick={(e) => toggleModal(order.orderId)}>View</button></td>
                                        <td> <div className={`status-badge ${order.Response.toLowerCase()}`}>
                                            {order.Response}
                                        </div></td>
                                        <td><button class="close-button" onClick={(e) => handleDeleteDialog(order.orderId)}>X</button></td></tr>))}


                                <Modal open={isModalOpen2}
                                    onClose={handleClose}
                                    toggle={toggleModal}
                                    // className='Model-containerfortable'
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <div className="modal-container delete-modal-container2">
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                //   justifyContent:"center",
                                                marginBottom: "2vh",
                                                overflowY: "hidden",
                                            }}
                                        >
                                            <Information data={OrderInfo} handleIncrement={handleIncrement} handleClose={handleClose} />
                                        </div>
                                    </div>
                                </Modal>
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
                                                //   justifyContent:"center",
                                                marginBottom: "2vh",
                                            }}
                                        >
                                            <img
                                                src={Alert}
                                                style={{ width: "50px", "margin-right": "1vw" }}
                                                alt="image  is here"
                                            />
                                            <h2>Delete Order</h2>
                                        </div>

                                        {data.map((item) => (
                                            <div>
                                                <p>Are you want to delete the Order of <strong>Mr/Mrs. {item.clientFName} {item.clientLName}</strong> having <strong>Order ID {item.orderId}</strong> </p>
                                                <Button variant="contained" onClick={() => deleteEntry(item.orderId)}>
                                                    Yes
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="contained" onClick={closeModal}>
                                            No
                                        </Button>
                                    </div>
                                </Modal>
                              
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Order;