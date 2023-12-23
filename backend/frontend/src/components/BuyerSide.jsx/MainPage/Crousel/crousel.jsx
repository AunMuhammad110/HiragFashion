import Carousel from "react-bootstrap/Carousel";
import React, { useContext, useState } from "react";

import "./carous.css";
import MainPageDataContext from "../../GlobalData/MainPage";

const Crousel = React.memo(() => {;
  const [index, setIndex] = useState(0);
  const {carrousalData}=useContext(MainPageDataContext)
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
              src={item.image}
              alt="Slide 1"
            />
          </div> 
        </Carousel.Item>
      ))}
    </Carousel>)
  // );
});
export default Crousel;
