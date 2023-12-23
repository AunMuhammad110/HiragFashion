import React from 'react';
import {Link } from  'react-router-dom';
// import { useHistory } from 'react-router-dom';

const Component = () => {
//   const history = useHistory();


  return (
    <div style={{width:"100%",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <div>

      <h1>Thank You for Your Order!</h1>
      <p>Your order has been confirmed. We appreciate your business!</p>
      <div style={{
justifyContent:"center"
      }}>
      <Link to="/">
          <button type="button" className={`btn btn-light checkout-button`}  onClick={()=>{navigate("/")}} style={{
          ':hover': {
            backgroundColor: 'lightgray',
            color: 'darkgray',
          },width:"95%"
        }} >CONTINUE SHOPPING</button>
          </Link>
      </div>
        </div>
    </div>
  );
};

export default Component;
