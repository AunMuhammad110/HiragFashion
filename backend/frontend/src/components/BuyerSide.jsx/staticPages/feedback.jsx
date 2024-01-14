import React from "react";
import { useState } from "react";
// import StarRating from "./star";
import { FormFeedback } from "reactstrap";
import axios from "axios";
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

function FormmFeedback() {
    // const productIds =[{productId:"D0010201",quantity:2},{productId:"D0010203",quantity:1}];
    // const [cartItem,setCartItems] = useState(productIds);

    // const addToCart = (productId) =>{
    //     setCartItems((prev)=>({...prev,"productId":productId}))
    // }
    // addToCart("1212332");
    // console.log(cartItem)
    //this is for data saving
    const [FormData, setFormData] = React.useState(
        {
            namee: "",
            mail: "",
            review: ""
        }
    )

    //for star rating useState
        const handleSubmit=(e)=>{
            e.preventDefault();
            handlesubmission();
            }
            const handlesubmission = async () => {
                try {
                    console.log("it enters")
                    const response = await axios.post("http://localhost:3334/saveFeedback", {FormData: FormData, rating: rating});
                    
                    // console.log("Status:", response.status);
                    // console.log("Data:", response.data);
            
                    if (response.status === 201) {
                        setFormData( {
                            namee: "",
                            mail: "",
                            review: ""
                        })
                    } else {
                        // window.alert("Error occurred");
                    }
                } catch (error) {
                   console.error(error)
                }
            };
            

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(preFormData => {
            return {
                ...preFormData,
                [name]: value
            }
        })
    }
    const [rating, setValue] = useState(1); // Set an initial value for the Rating component

    return (
        <>
        <div className="static-container">
      <div className="tc-static-container">
        <h1 className="hr-mb-50">Customer Review</h1>
        <form>
                                <div className="form-group">
                                    <label className='d-flex align-items-left my-2' htmlFor="namee">Name</label>
                                    <input type="text"
                                        className="form-control my-2 w-100" id="namee"
                                        name="namee"
                                        onChange={handleChange}
                                        value={FormData.namee}
                                        placeholder="Enter your name" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mail" className="d-flex text-allign-left my-2">Email</label>
                                    <input
                                        type="text" className="form-control my-2 w-100"
                                        id="mail"
                                        name="mail" placeholder="aun.muhammad@example.com"
                                        onChange={handleChange}
                                        value={FormData.mail} required />
                                </div>

                                {/* for rating starss */}
                                <div>
                                    <Typography component="legend" className="d-flex text-allign-left my-2">Rating</Typography>
                                    <Rating
                                        style={{
                                            // width:"20px",
                                            // height:"20px",
                                            fontSize:"80px"
                                        }}
                                        name="simple-controlled"
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setValue(newValue);
                                        }}
                                        className="d-flex text-allign-left my-2 w-100"
                                    />
                                    {/* <Typography component="legend">Read only</Typography>
                                    <Rating name="read-only" value={value} readOnly /> */}
                                </div>
                            
                                <div className="form-group">
                                    <label htmlFor="review" className="d-flex text-allign-left my-2">Write review</label>
                                    <textarea
                                        name="review" className="d-flex text-allign-left col-12 pt-2 w-100 rounded-2"
                                        id="review"
                                        placeholder=" Enter your comments here"
                                        rows="5"
                                        onChange={handleChange}
                                        value={FormData.review} required></textarea>
                                </div>
                                <div className="col d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary my-4 p-2 " onClick={(e)=>{handleSubmit(e)}}>SUBMIT REVIEW</button></div>
                            </form>
        </div>
        </div>
        
        </>
    );
}
export default FormmFeedback;