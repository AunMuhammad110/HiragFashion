import React, { useState, useEffect } from "react";
import "./checkout.css";
import { Link } from "react-router-dom";
import OrderForm from "../OrderForm/Form";
import Navbarr from "../Navbarr/navbar";
import Footer from "../footer/footer";
import { useDataContext } from "../useContextt/context";
import remove_icon from "../Checkout/remove_icon.png";
// import { useNavigate } from "react-router-dom";
import Imagee from "../Card/imgs/hania.jpg";
import Imageee from "../Checkout/empty-cart.png";

function CheckOut() {
  const { data, loading, removeFromContext, removeFromCart, TotalCalculator } =
    useDataContext();

    console.log("The data is "+ data);
  const [smallImagesVisible, setSmallImagesVisible] = useState(true);
  const [total, setTotal] = useState(0);
  // console.log(data)
  // const removeFromContext = useDataContext();
  // if (data) {
  //     return (
  //       <div>
  //         <h2>Data is available!</h2>
  //         <YourComponentWithData />
  //       </div>
  //     );
  //   } else {
  //     return <p>Loading...</p>;
  //   }
  // if(loading){
  //     return <p>Loading.....</p>
  // }

  const handleRemoveProduct = (productId) => {
    removeFromContext(productId);
  };

  useEffect(() => {
    // Check the screen width and hide small images on mobile screens
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSmallImagesVisible(false);
      } else {
        setSmallImagesVisible(true);
      }
    };

    // Add an event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check when the component mounts
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // below state for orderform
  const [orderForm, setOrderForm] = useState(false);
  const handleChangeOfbtn = () => {
    setOrderForm(!orderForm);
  };
  const [value, setValue] = useState(1);

  // // Function to handle changes to the value
  // const handleChange = (event,quantity) => {
  //     const newValue = parseInt(event.target.value, 10);
  //     // Check if the new value is greater than or equal to 1

  //     if (!isNaN(newValue) && newValue >= 1 && newValue <= 10) {
  //         setValue(newValue);
  //     }    };
  // useEffect(()=>{
  //     const TotalCalculator = async () =>{
  //         const total =await data.map(item=>
  //             item._doc.productPrice).reduce((acc,price)=>acc+price,0)
  //             setTotal(total)
  //     }
  //     TotalCalculator();
  // },[])
  // console.log(total)
  function handleValueChange(val) {
    setValue(val);
  }

  // const handleClick = () =>{
  //     addToCart("D1234567");
  // }
  const handleRemoveCartt = (parea) => {
    // window.alert("The product is deleted "+parea)
    removeFromCart(parea);
  };

  return (
    <>
      {<Navbarr />}
      {smallImagesVisible && (
        <>
          {data.length > 0 ? (
            <>
              <div className="container my-4">
                <div className="row d-flex">
                  <div className="col-6  d-flex justify-content-center ">
                    <h1>Your Cart</h1>
                  </div>

                  <div className="col-6 d-flex justify-content-center align-items-center pb-4">
                    <Link to="/context/orderform">
                      <button
                        type="button"
                        className="checkout-button"
                        onClick={handleChangeOfbtn}
                      >
                        Proceed To checkout
                      </button>
                    </Link>
                  </div>
                  {orderForm && <OrderForm />}
                  <hr className="w-100" />
                </div>
                <div className="row">
                  <div className="col-1 sizz">Product</div>
                  <div className="col-5 sizz pl-5">Title</div>
                  <div className="col-2 sizz">Quantity</div>
                  <div className="col-2 sizz">Price</div>
                  <div className="col-2 sizz remove-icon-head">Remove</div>
                  <hr className="w-100" />
                </div>
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <div key={item._doc.productId} className="row">
                      <div className="col-1 mr-2">
                        <img
                          id="logo-img"
                          src={item._doc.images[0]}
                          alt="Product Image"
                        />
                      </div>
                      <div className="col-5">
                        <p style={{ fontSize: "15px" }}>
                          {" "}
                          {item._doc.brandName}{" "}
                          {item._doc.subBrandName} {item._doc.productTitle}
                        </p>
                        {/* <button className="remove-btn" onClick={(e)=>handleRemoveCartt(item._doc.productId)}>Remove</button> */}
                      </div>
                      <div className="col-2">
                        <button className="cartitems-quantity">
                          {item.quantity}
                        </button>
                      </div>
                      <div className="col-2">
                        <p className="price">
                          Rs {item._doc.productPrice * item.quantity}.00
                        </p>
                      </div>
                      <div className="col-1 justify-icon">
                        {/* <p>{item._doc.productId}</p> */}
                        <img
                          className="remove-icon"
                          src={remove_icon}
                          alt="remove_i"
                          onClick={(e) =>
                            handleRemoveCartt(item._doc.productId)
                          }
                        />
                      </div>
                      <hr className="my-2 w-100" />
                    </div>
                  ))
                ) : (
                  <p>No items added to the cart.</p>
                )}
                <div className="row">
                  <div className="col-4"></div>
                  <div className="col-4">
                    <Link to="/context/orderform">
                      <button
                        type="button"
                        className="checkout-button d-inline my-md-3"
                        onClick={handleChangeOfbtn}
                      >
                        Proceed To checkout
                      </button>
                    </Link>
                  </div>
                  <div className="col-2 mj">
                    <p className="bold-text">Grand Total</p>
                  </div>
                  <div className="col-2 mj">
                    <p className="rup">Rs. {TotalCalculator()}.00</p>
                  </div>
                </div>
                <div className="row gt">
                  <p className="d-flex justify-content-center mt-3 OrderRes">
                    Hira G's process all orde2rs in PKR. While the content of
                    your cart is currently displayed in PKR, you will check out
                    using PKR at the most current exchange rate.
                  </p>
                </div>
                {/* isko hatana ha baad main */}
                {/* <div className="row">
            <button className=" btn-primary"onClick={handleClick}>ADD</button>
            <br />
            <hr />
        {/* <button className="btn-primary"onClick={handleRemoveClick}>Remove</button> 
            </div> */}
              </div>
            </>
          ) : (
            <div className="container">
              <div className="row">
                <img src={Imageee} alt="" srcset="" />
              </div>
            </div>
          )}
        </>
      )}
      {!smallImagesVisible && (
        <div className="container " style={{ paddingLeft: "10px" }}>
          <div className="row d-flex justify-content-center ">
            <h1 className="my-1">YOUR CART</h1>
          </div>
          <hr style={{ marginTop: "8px", marginBottom: "8px" }} />
          <div className="row">
            <div className="col-md-5">
              {data.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="row seq-ord-1">
                    <div className="col-12 pl-3">
                      <div className="row my-2">
                        <div
                          className="col-3 d-flex justify-content-center p-1"
                          style={{
                            marginTop: "6px",
                            marginBottom: "6px",
                            padding: "none",
                          }}
                        >
                          <a href="#" className="anchir">
                            {" "}
                            <img
                              className="image"
                              src={item._doc.images[1]}
                              alt="Your Alt Text"
                              style={{
                                maxWidth: "80px",
                                width: "75px",
                                maxHeight: "90px",
                              }}
                            />{" "}
                            <span
                              className="bg-dark pos"
                              style={{ color: "#fff" }}
                            >
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {item.quantity}
                              </p>
                            </span>
                          </a>
                        </div>
                        <div className="col-6 d-flex flex-column">
                          <div className="">
                            <p>
                              {item._doc.brandName} {item._doc.subBrandName}{" "}
                              {item._doc.productTitle}
                            </p>
                          </div>
                          <div className="remove-btnn">
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveCartt(item._doc.productId)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="col-3">
                          <div>Rs. {item._doc.productPrice}.00/-</div>
                        </div>
                      </div>
                      <hr style={{ marginTop: "14px", marginBottom: "8px" }} />
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div
            className="row pr-4 d-flex justify-content-end"
            style={{ marginBottom: "none", height: "27px" }}
          >
            <p style={{ marginBottom: "2px" }}>
              <b>Grand Total</b>&nbsp;&nbsp;&nbsp;Rs.{TotalCalculator()}.00
            </p>
          </div>
          <div
            className="row d-flex justify-content-end pr-4 "
            style={{ marginBottom: "none", height: "24px" }}
          >
            <p className="sizeOfTax" style={{ marginBottom: "2px" }}>
              Shipping & taxes calculated at checkout
            </p>
          </div>
          <div className="">
            <Link to="/">
              <button
                type="button"
                className={`btn btn-light checkout-button cont-button mb-2 mt-2`}
                style={{
                  ":hover": {
                    backgroundColor: "lightgray",
                    color: "darkgray",
                  },
                }}
              >
                CONTINUE SHOPPING
              </button>
            </Link>
          </div>
          {/* <br /> */}
          <div className="">
            <Link to="/context/orderform">
              <button
                type="button"
                className="checkout-button"
                onClick={handleChangeOfbtn}
              >
                PROCEED TO CHECKOUT
              </button>
            </Link>
          </div>
          <div className="row gt">
            <p className="d-flex justify-content-center mt-3 OrderRes">
              Hira G's process all orders in PKR. While the content of your cart
              is currently displayed in PKR, you will check out using PKR at the
              most current exchange rate.
            </p>
          </div>
        </div>
      )}
      {<Footer />}
    </>
  );
}

export default CheckOut;
