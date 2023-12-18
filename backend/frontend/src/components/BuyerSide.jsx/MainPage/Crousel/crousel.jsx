import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "./carous.css";
import { useRequestProcessor } from "../../../../apisSetup/requestProcessor";
import image from './carrousal.jpeg'
import axiosClient from "../../../../apisSetup/axiosClient";
import MainPageDataContext from "../../GlobalData/MainPage";

const Crousel = React.memo(() => {
  const { query } = useRequestProcessor();
  const [index, setIndex] = useState(0);
  const {carrousalData}=useContext(MainPageDataContext)
  // console.log("Data from the carrousal component is ", carrousalData)
  // const [carrouselData, setCarrousalData] = useState([]);
  // const {data,refetch}=query("CarrousalData",async () => {
  //    await axiosClient.get("/GetCarrousalDetails").then((response) =>{
  //     setCarrousalData(response.data);
  //     // console.log(response.data);
  //    })
    
  // })
  // ,{enabled:false})
  // useEffect(()=>{
  //   refetch();
  // },[])
  // useEffect(()=>{
  //   window.location.reload();
  // },[])
  // useEffect(() => {
  //   const intervalId = setInterval(
  //     () => setIndex((index) => index + 1),
  //     7000 // Transition every 7 seconds
  //   );

  //   return () => clearInterval(intervalId);
  // }, []);
  if(carrousalData.isLoading){
    return(
      <></>
    )
  }
  return (
    <Carousel
      interval={8000} /* Change slide every 8 seconds (3000 milliseconds) */
    className="hr-mb-10">
      {carrousalData?.data?.map((item, index) => (
        <Carousel.Item key={index}>
          <div className="carousel-adj d-flex align-items-center ">
            <img
              className="w-100 heightt"
              // Dear Auni.. you need to build logic of  this image (Static image is used) :(
              src={item.image}
              alt="Slide 1"
            />
            {/* <div className="center-caption">
              <Carousel.Caption>
                <TextTransition
                  springConfig={{ mass: 1, tension: 90, friction: 96 }}
                  direction="up"
                  text="text"
                  interval={3000}
                >
                  <div className=" cr-cap new">
                    <h3 className="text-size">
                      {item.brandName} {item.subCategoryName}
                    </h3>
                    <p>100% original</p>
                    <button className="btn  btn-light">Shop Now</button>
                  </div>
                </TextTransition>
              </Carousel.Caption>
      </div>*/}
          </div> 
        </Carousel.Item>
      ))}
    </Carousel>)
  // );
});
export default Crousel;
