import React, { useState, useEffect, useRef } from "react";
import './form.css';
import ReCAPTCHA from 'react-google-recaptcha';
import Imagee from '../Navbarr/hg2r.png';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useDataContext } from "../useContextt/context";
import Component from "./ThankComp";
import TotalDrop from "./MobScreem";
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// import {Link,navigate} from 'react-router-dom';
// const ThanksYouComponent = () =>{
//     return(
//         <Link path="/">
//         <button type="button" className={`btn btn-light cont-button mb-2 mt-2`} onClick={()=>{navigate("/")}} style={{
//         ':hover': {
//           backgroundColor: 'lightgray',
//           color: 'darkgray',
//         },
//       }} >CONTINUE SHOPPING</button>
//         </Link>
//     )
// }
const OrderForm = () => {

    const { data, TotalCalculator, WeightCalculator, NumberofProduct } = useDataContext();
    const [shipmentTotal, setShipmentTotal] = useState(0);

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [smallImagesVisible, setSmallImagesVisible] = useState(true);

  
    const [uniqueId, setUniqueId] = useState(uuidv4().slice(0, 5));

    const generateNewId = () => {
        setUniqueId(uuidv4().slice(0, 5));
    };
    // for form
    const [formData, setFormData] = useState(
        {
            Email: "",
            FirstName: "",
            LastName: "",
            Address: "",
            PostCode: "",
            City: "",
            PhoneNumber: 0
        }
    )
    const [errorMessages, setErrorMessages] = useState({});

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (selectedFile == null) {
            newErrors.selectedFile = 'Please Attach the Screen Shot of the Payment';
            valid = false;
        }
        setErrorMessages(newErrors);
        console.log(valid)
        return valid;
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    };
    const IdandQuantity = () => {
        return data.map(({ _doc: { productId }, quantity }) => ({ productId, quantity }));
    }
    // IdandQuantity()
    const navigate = useNavigate();
    const HandleNavigate =()=>{
        navigate('/context/thankcomp')
    }
    const [ThankCompStat, setThankCompStat]=useState(false);
    const saveOrderData = () => {
        axios
            .post("http://localhost:3334/addOrder", {
                clientFName: formData.FirstName,
                clientLName: formData.LastName, Address: formData.Address, Location: formData.City, email: formData.Email, PhoneNo: formData.PhoneNumber, orderId: uniqueId, countryName: selectedCountry, PaymentSS: selectedFile, totalBill: shipmentTotal + TotalCalculator(), NoOfProduct: NumberofProduct(), productsInfo: IdandQuantity(), shipmentTotal: shipmentTotal
            }).then(
                (response) => {
                    return (response.status);
                })
            .catch(error => {
                console.log(error.response)
            })
            HandleNavigate();
    };

    // below is for captcha
    const [valid_token, setValidToken] = useState([]);

    const SITE_KEY = '6LdcKjopAAAAAIBUx6hGx93zMpk3GUTildD1pQ4k';
    const SECRET_KEY = '6LdcKjopAAAAAD9yxF_Mbnay96ddNCcm1P9M2YZa';
    const captchaRef = useRef(null);


    const handleSubmit = async (event) => {
        event.preventDefault();
        let token = captchaRef.current.getValue();
        captchaRef.current.reset();

        if (token) {
            let valid_token = await verifyToken(token);
            setValidToken(valid_token);

            if (valid_token[0].success === true) {
                generateNewId();
                if (validateForm()) {
                    // Form is valid, you can proceed with further actions
                    console.log('Form submitted:', formData);
                    resetFormData();
                    saveOrderData();
                } else {
                    // Form is not valid, show an error message or take appropriate action
                    console.log('Form validation failed');
                }
                console.log("verified by captcha");
            } else {
                console.log("not verified");
            }
        }else{
            window.alert(" Sorry!! Verify you are not a bot")

        }

    }
    function resetFormData() {
        setFormData({
            Email: "",
            FirstName: "",
            LastName: "",
            Address: "",
            PostCode: "",
            City: "",
            PhoneNumber: 0
        });
        setSelectedCountry('');
        setSelectedFile(null);
    }

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
        window.addEventListener('resize', handleResize);

        // Initial check when the component mounts
        handleResize();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Fetch the list of countries from the backend
        const fetchCountries = async () => {
            try {
                const response = await axios.get('http://localhost:3331/fetchCountryDetails');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
        // console.log(selectedCountry)
    }, []);

    useEffect(() => {
        if (selectedCountry !== "") {
            CalculateShipment();
        }
    }, [selectedCountry])

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        // validateForm();

    };
    const CalculateShipment = () => {
        setTimeout(() => {
            const countryPrices = countries.find(item => item.countryName === selectedCountry);
            const { firstKg, addKg } = countryPrices;
            console.log(firstKg, addKg)
            const calculatedShipmentPrice = WeightCalculator() <= 1 ? firstKg : firstKg + (WeightCalculator() - 1) * addKg;
            setShipmentTotal(calculatedShipmentPrice);
        }, 1000)
    }

    // below is file of payment attachment
    const [selectedFile, setSelectedFile] = useState(null);

    const displaySelectedImage = (event) => {
        const fileInput = event.target;

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                setSelectedFile(e.target.result);
            };

            reader.readAsDataURL(fileInput.files[0]);
        }
    };

    // below code is for captcha


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     let token = captchaRef.current.getValue();
    //     captchaRef.current.reset();

    //     if (token) {
    //       let valid_token = await verifyToken(token);
    //       setValidToken(valid_token);

    //       if (valid_token[0].success === true) {
    //         console.log("verified");
    //         setSuccessMsg("Hurray!! you have submitted the form")
    //       } else {
    //         console.log("not verified");
    //         setErrorMsg(" Sorry!! Verify you are not a bot")
    //       }
    //     }
    //   }
    const verifyToken = async (token) => {
        let APIResponse = [];

        try {
            let response = await axios.post(`http://localhost:3334/verify-token`, {
                reCAPTCHA_TOKEN: token,
                Secret_Key: SECRET_KEY,
            });

            APIResponse.push(response['data']);
            console.log(APIResponse);
            return APIResponse;

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="container my-3 p-0">
                        <div className="row">
                            <div className="col-md-7 col-12">
                                <div className="row ">
                                    <img src={Imagee} alt="image" srcset="" className="size" />
                                    <a href="/context/chkout" className='p-2' style={{ textDecoration: "none" }}><i className="fas fa-shopping-cart" id='bag-Icon' aria-hidden="true"></i></a>
                                </div>
                                <hr />
                                {/* it only display when screen is responsive */}
                                {!smallImagesVisible &&
                                    <div className="col-12" style={{ padding: "1px" }}>
                                        {/* <div className="row "> */}
                                        <TotalDrop shipmentTotal={shipmentTotal} />
                                        {/* </div> */}
                                    </div>
                                }

                                {/* <FormProvider {...methods}> */}
                                <form style={{ marginLeft: "15px", marginRight: "15px" }} onSubmit={handleSubmit}>
                                    <div className="row my-1 ">
                                        <h2 >Contact</h2>
                                    </div>
                                    <div className="row">
                                        <input
                                            type="Email"
                                            name="Email" id="Email" onChange={handleChange} value={formData.Email}
                                            className={`inputcss px-3 py-2 rounded-md border border-gray-3000 focus:outline-none focus:border-blue-500 transition duration-300`}
                                            placeholder="example@gmail.com"
                                            required
                                            style={{ marginLeft: "0", width: "100%" }}

                                        // {...register('Email', { required: 'Email is required' })}
                                        />
                                        {/* {errorMessages.Email && <div className="error-message ml-2 text-danger">{errorMessages.Email}</div>} */}
                                        {/* {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>} */}

                                    </div>

                                    <div className="row d-inline-block">
                                        <label htmlFor="Email" className="pad" style={{ paddingLeft: "1vw" }}>
                                            <input type="checkbox" className="foremail" />
                                            <span className="txt">Email me with news and update</span></label>
                                    </div>

                                    <div className="row mt-3 mb-1">
                                        <h3>Shipping Address / Details</h3>
                                    </div>
                                    {/* Below is for country  */}
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="dropdownInput"><span> Country/Region</span></label>
                                            <select
                                                className={`form-control ${errorMessages.Country ? 'error' : ''}`}
                                                id="dropdownInput"
                                                value={selectedCountry}
                                                onChange={handleCountryChange}
                                                style={{ width: "100%" }}
                                                required
                                            >
                                                {/* {errorMessages.Country && <div className="error-message ml-2 ">{errorMessages.Country}</div>} */}

                                                <option value="" disabled>Select a country</option>
                                                {countries.map((country) => (
                                                    <option key={country.id} value={country.countryName}>
                                                        {country.countryName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6" style={{ paddingLeft: "2px" }}>
                                            {/* for First Name */}
                                            <label htmlFor="FirstName">First Name </label>
                                            <div className="input-group mb-2">
                                                <input type="text" id='FirstName' required name="FirstName" onChange={handleChange} value={formData.FirstName} className={`form-control ${errorMessages.FirstName ? 'error' : ''}`} placeholder="Aun" aria-label="Recipient's username" aria-describedby="basic-addon2" />

                                            </div>
                                            {/* {errorMessages.FirstName && <div className="error-message ml-2 ">{errorMessages.FirstName}</div>} */}

                                        </div>

                                        {/* Second Name */}
                                        <div className="col-6" style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                            <label htmlFor="LastName">Last Name</label>


                                            <div className="input-group mb-2">
                                                <input type="text" id="LastName" required name="LastName" onChange={handleChange} value={formData.LastName} className={`form-control ${errorMessages.LastName ? 'error' : ''}`} placeholder="Muhammad" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                            </div>
                                            {/* {errorMessages.LastName && <div className="error-message ml-2 ">{errorMessages.LastName}</div>} */}
                                        </div>
                                    </div>

                                    {/* for Address */}
                                    <div className="row">
                                        <label htmlFor="Address">Address</label>
                                        <div className="input-group mb-2">
                                            <input type="text" id="Address" name="Address" required onChange={handleChange} value={formData.Address} className={`form-control ${errorMessages.Address ? 'error' : ''}`} placeholder="House # 13 Street 21 A......" aria-label="Recipient's username" aria-describedby="basic-addon2" />

                                        </div>
                                        {/* {errorMessages.Address&& <div className="error-message ml-2 ">{errorMessages.Address}</div>} */}
                                    </div>
                                    <div className="row">
                                        {/* for city  */}
                                        <div className="col-6" style={{ paddingLeft: "2px" }}>
                                            <label htmlFor="City">City</label>
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    id="City"
                                                    name="City"
                                                    onChange={handleChange}
                                                    value={formData.City}
                                                    className="form-control" placeholder="London" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                            </div>

                                        </div>
                                        {/* For postal code */}
                                        <div className="col-6" style={{ paddingLeft: "2px", paddingRight: "2px" }}>
                                            <label htmlFor="PostCode">Postal Code</label>
                                            <div className="input-group mb-2">
                                                <input type="text"
                                                    name="PostCode"
                                                    id="PostCode"
                                                    onChange={handleChange}
                                                    value={formData.PostCode}
                                                    className="form-control" placeholder="32432" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <label htmlFor="PhoneNumber">
                                            Phone No.
                                        </label>
                                        <div className="input-group mb-2">
                                            <input type="tel"
                                                id="PhoneNumber"
                                                name="PhoneNumber"
                                                onChange={handleChange}
                                                value={formData.PhoneNumber}
                                                className={`form-control ${errorMessages.PhoneNumber ? 'error' : ''}`} required aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                        </div>
                                        {/* {errorMessages.PhoneNumber && <div className="error-message ml-2 ">{errorMessages.PhoneNumber}</div>} */}
                                    </div>
                                    <div className="row">
                                        <div className="payment">
                                            <div style={{ display: "inline-block" }}>
                                                <h3>Payment</h3>
                                                <div className="d-flex justify-content-center">
                                                    <div className="btn btn-dark btn-rounded mb-2">
                                                        <label className="form-label text-white m-1" htmlFor="customFile1">
                                                            {selectedFile ? 'File Attached' : 'Choose File'}
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className={`form-control d-none`}
                                                            id="customFile1"
                                                            name="customeFile1"
                                                            onChange={(event) => displaySelectedImage(event)}

                                                        />
                                                    </div>
                                                    {errorMessages.selectedFile && <div className="error-message ml-2 d-flex align-items-center ">{errorMessages.selectedFile}</div>}

                                                    {/* {selectedFile && (
                                                        {/* {selectedFile && (
        <div className="mt-2">
          <img 
          src={selectedFile} 
          alt="Selected File"
          style={{ maxWidth: '100%', maxHeight: '200px' }} 
          />
        </div>
      )} */}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ backgroundColor: "white", color: "grey", border: "1px solid", borderRadius: "10px" }}>
                                                    <p style={{ fontSize: "12px", padding: "5px", marginBottom: "0" }}>
                                                        <b>Bank Name:</b> Meezan Bank Limited<br />
                                                        <b>Account Title:</b> MISBAH FATIMA/SHEIKH MUHAMMAD SIDDIQ <br />
                                                        <b>Account No:</b> 21030104841517 <br />
                                                        <b>Branch Code:</b> 2103 <br />
                                                        <b>IBAN:</b> PK03 MEZN0021030104841517 <br />
                                                        <b>Branch Address:</b> HIGH STREET SAHIWAL <br />
                                                        <b>Swift code:</b> <br />
                                                        Kindly attach the proof of payment below and if you want to avail the services of stiching You may contact us on whatsapp +92336912179</p>
                                                </div>
                                             



                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <ReCAPTCHA
                                            className="recaptcha"
                                            sitekey={SITE_KEY}
                                            ref={captchaRef}
                                        />
                                    </div>
                                    <div className="row">
                                            {/* <Link to='/context/thankcomp'> */}
                                        <div className="w-100">
                                            <button type="submit" className="btn btn-primary my-2 ">Confirm Order</button></div>
                                            {/* </Link> */}

                                    </div>
                                </form>
                                {ThankCompStat && <Component/>}
                                {/* </FormProvider> */}
                            </div>





                            {/* Right side */}
                            {smallImagesVisible &&
                                <div className="col-md-5 col-12 pl-md-4 pt-4">
                                    <div className="row seq-ord-1 h-10" >
                                        {data && data.map((item) => (
                                            <div style={{ display: "flex", minHeight: "100px", height: "auto", minWidth: "100%" }}>
                                                <div className="col-3" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <a href="#" className="anchirr" >
                                                        <img className="imageee" src={item._doc.images[0]} alt="Your Alt Text"
                                                            style={{ maxWidth: "80px", width: "70px", maxHeight: "90px" }} />
                                                        <span className="bg-dark poss" style={{ color: "#fff" }}>
                                                            <p style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "blue" }}>
                                                                {item.quantity}</p></span>
                                                    </a>
                                                </div>
                                                <div className="col-6" style={{ paddingLeft: "7px", paddingRight: "4px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <p style={{ fontSize: "14px" }}>{item._doc.brandName} {item._doc.productTitle}</p>
                                                </div>
                                                <div className="col-3" style={{ paddingLeft: "2px", paddingRight: "2px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <div id="pos"><span>Rs. {item._doc.productPrice}.00/-</span></div>
                                                </div>
                                                <br />
                                            </div>

                                        ))}
                                        {/* second and so onm */}
                                    </div>

                                    <hr />
                                    {/* belwo is for calcualtion */}
                                    <div className="row" >
                                        <div className="col-6">
                                            Subtotal <br />
                                            Shipping
                                        </div>
                                        <div className="col-6" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingRight: "1px" }}>
                                            <div className="" style={{ textAlign: 'right', fontSize: '16px', paddingLeft: 0 }}>
                                                Rs.{TotalCalculator()}.00/-
                                            </div>
                                            <div className="" style={{ textAlign: 'right', fontSize: '16px', paddingLeft: 0 }}>
                                                {shipmentTotal !== 0 ? (
                                                    `Rs.${shipmentTotal}.00/-`
                                                ) : (
                                                    <span style={{ textAlign: 'right', paddingLeft: 0 }}>Calculating...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <hr />
                                    <div className="row">
                                        <div className="col-6">
                                            Total
                                        </div>
                                        <div className="col-6 " style={{ textAlign: 'right', fontSize: '16px', paddingLeft: 0, paddingRight: "1px" }}>
                                            <div className="">
                                                Rs.{shipmentTotal + TotalCalculator()}.00/-
                                            </div>
                                        </div>
                                    </div>


                                </div>}

                        </div>

                    </div>
                </div>
                <div className="row align-item-flex-end">
                    {/* <div className="copyright"> @Copyright 2023 | All Right Reserved and developed by Auniz Tech Innovators</div> */}
                </div>
            </div>

        </>
    )
}
export default OrderForm;