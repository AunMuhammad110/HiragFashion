import React from "react";
import { useEffect,useState } from "react";
// import StarRating from "./Feedback/star";
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

function FeedBack(){
    const sizee ={
        'font-size':'23px'
    }
    const [data, setdata] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {

          const response = await axios.get('http://localhost:3334/getFeedbacks');
        //   console.log(response.data);
          setdata(response.data); // Assuming the data is in response.data
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, []);
        const handleDelete = async (mail) => {
          try {
            console.log("its working")
            const response = await axios.post(`http://localhost:3334/delFeedback`,{mail:mail});
      
            if (response.status === 200) {
              onDelete(); 
              // Trigger a callback or perform any other necessary action
            } else {
              console.error('Error deleting feedback:', response.status);
            }
          } catch (error) {
            console.error('Error deleting feedback:', error.message);
          }};
          const handleClick =(mail)=>{
            handleDelete(mail);
          }
    if(data.length ===0) return <></>

    return(
        <>
<div className="static-container h-90 ">
      <div className="faq-static-container">
        <h1>Client Reviews</h1>
        <hr />
        {data && data.map((item)=>(
                    <>
                    <div className="row">
                <div className="col-10 pl-2">
                <div><b>Name: </b>{item.namee}</div>
                <div><b>Mail: </b><a href={`mailto:${item.mail}`}>{item.mail}</a></div>
                <div className="row">
                <Typography component="legend"
                className="col-1"><b>Rating</b></Typography>
    <Rating name="read-only" value={item.rating} className="col-1"readOnly />  
                </div>
                <div><b>Comments:</b> {item.review} 
                </div>
                </div>
                <div className="col-2">
                <button type="button" class="custom-button " onClick={(e)=>{handleClick(item.mail)}}>Delete</button>
                </div>
                </div>
                    <hr />
            </>
            
            ))}
        {/* {data.length !== 0  ?  (
            <>
            {data && data?.map((item)=>(
                    <>
                    <div className="row">
                <div className="col-10 pl-2">
                <div><b>Name: </b>{item.namee}</div>
                <div><b>Mail: </b><a href={`mailto:${item.mail}`}>{item.mail}</a></div>
                <div className="row">
                <Typography component="legend"
                className="col-1"><b>Rating</b></Typography>
    <Rating name="read-only" value={item.rating} className="col-1"readOnly />  
                </div>
                <div><b>Comments:</b> {item.review} 
                </div>
                </div>
                <div className="col-2">
                <button type="button" class="btn btn-dark" onClick={(e)=>{handleClick(item.mail)}}>Delete</button>
                </div>
                </div>
                    <hr />
            </>
            
            ))}</>
        ):
        <>
        <div>
            <h4>No Feedback</h4></div></>} */}
        </div>            
        </div>

        </>
    );
}
export default FeedBack;