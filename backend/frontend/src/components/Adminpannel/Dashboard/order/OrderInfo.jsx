import React,{useEffect, useState} from 'react';
// import * as bootstrap from 'bootstrap'
// // Import all of Bootstrap's CSS
// import "bootstrap/scss/bootstrap";
// import './assets/s1.jpg';
// import FormmFeedback from './Feedback/FeedbackForm';
import './order.css';
import axios from 'axios'
export default function Information(props){
  //use State for defining change 
  const [productData,setData] = useState([])
  const [productInfo,setproductInfo]=useState([])
  useEffect(() => {
    const fetchData = async (productInfo) => {
      try {
        // console.log(productInfo.id)
        const response = await axios.post("http://localhost:3334/GetProducts",productInfo);
        console.log("yeh raha response", response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(productInfo);
  },[productInfo])
const handleProductInfo =(Info)=>{
      setproductInfo(Info)
}
  //Fetching product data
  // const fetchData = async (data) => {
  //       try {
  //         const response = await axios.post("http://localhost:3334/GetProducts", data);
  //         console.log("yeh raha response", response.data);
  //         setData(response.data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  const ChangeResponse = async (id,status) =>{
    try {
      await axios
      .put('http://localhost:3334/updateOrderResponse',{id,status})
      .then((response)=>{
        if(response.status===200){
            console.log('Order response updated:', response.data);
          }})
          props.handleIncrement();
          props.handleClose();
        }
      catch(error){
        console.error('Error updating order response:', error);
      }
    }
  
  return(
        <>
         {props.data.map((item) => (
          <>
        <div className="container text-center my-2">
            <div className="row d-flex f-direction-column">
          <h1 className='d-flex justify-content-end col-7 mainn-head' >Order Details</h1>
          <div className="col-5">
<button className="accept-button" style={{width:"90px",marginTop:"10px"}} onClick={(e)=>ChangeResponse(item.orderId,"accepted")}>Accept</button>
<button className="reject-button" style={{width:"90px",marginTop:"10px"}} onClick={(e)=>ChangeResponse(item.orderId,"rejected")}>Reject</button>
          </div>

            </div>
          
          <hr  style={{marginTop:"5px"}}/>
  <div className="row">
    <div className="col w-50 ord" >
    <h2 className='my-3 head'>Customer  Information</h2>
      <hr />
      <div className='subc'>
        
      <div className="row">
          <div className="col-3"><b><p>Order ID</p></b></div>
        <div className="col-9"><p>{item.orderId}</p></div>
        </div>
        <div className="row">
          <div className="col-3"><b><p>Name:</p></b></div>
        <div className="col-9"><p>{item.clientFName} {item.clientLName}</p></div>
        </div>
        <div className="row">
          <div className="col-3"><b><p>Email:</p></b></div>
        <div className="col-9"><p>{item.email}</p></div>
        </div>
        <div className="row">
          <div className="col-3"><b><p>Contact:</p></b></div>
        <div className="col-9"><p>{item.PhoneNo}</p></div>
        </div>
        <div className="row">
          <div className="col-3"><b><p>Country/ Region:</p></b></div>
        <div className="col-9"><p>Pakistan</p></div>
        </div>
        <div className="row">
          <div className="col-3"><b><p>Shipping Address:</p></b></div>
        <div className="col-9"><p>{item.Address}</p></div>
        </div>
        <div className="row">
          <div className="col-3"><b><p>Total Bill</p></b></div>
        <div className="col-9"><p className='inlinee'>Rs </p><p className='inlinee'>{item.totalBill}</p></div>
        </div>
  
        <hr />
        <h2 className='text-center head'>Payment</h2>
        <hr />
        <div className="col-12" ><button className='btn btn-primary btn-xs mx-2 my-3' >Download Reciept</button></div>
        <img src={item.Image} alt="No Payment Slip Given" width='100%' height='800px'/></div>
        
      {/* </div>s */}
      </div>
    <div className="col w-50">
      <div className="ord">
          <h2 className='my-3 head' onClick={()=>handleProductInfo(item.productsInfo)}>Product Details</h2>
          {productData.map((itemi)=>(
<>
<hr className='mx-2'/>
<div className="row custom-row-spacing">
  <div className="col-3">
    <img src='https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg' alt="Image of Suit" height='90px' width='80px' className='mx-3'/>
  </div>
  <div className="col-5 d-flex align-items-center mx-2" style={{fontSize:"14px"}}><b>{itemi._doc.brandName} {itemi._doc.subBrandName} {itemi._doc.productTitle}</b></div>
  <div className="col-3 d-flex align-items-center" style={{fontSize:"15px",paddingLeft:"2vw"}}>
    <b >Rs.{itemi._doc.productPrice*itemi.quantity}.00</b></div>
</div>
{/* <hr className='mx-2' /> */}

</>  
          ))}
<br />          </div>
          <div className="ord my-2">  
          <h3 className='my-3 head'>Stiching Details</h3>
          <hr className='mx-2'/>
          <p className='mx-2'>Stiching details will be present tere :: Lore
            m ipsum dolor sit amet, consectetur adipisicing elit. Nam
             tempora, itaque tenetur repellat dicta, esse voluptates sint mole
             stiae dolores ullam vel illum nostrum optio suscipit commodi quidem, 
             placeat cumque? Hic autem atque maxime. Repellat pariatur tenetur, ull
             am vitae libero sint.</p>
          </div> 
          <div>
          </div>

     </div>
  </div>
        </div>
          </>
        ))}
        </>
    )}