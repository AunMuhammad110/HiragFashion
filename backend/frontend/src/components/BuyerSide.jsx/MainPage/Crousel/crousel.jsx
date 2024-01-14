import Carousel from "react-bootstrap/Carousel";
import React, { useContext, useState, useEffect } from "react";

import "./carous.css";
import MainPageDataContext from "../../GlobalData/MainPage";
import TextTransition, { presets } from "react-text-transition";
import { Navigate, useNavigate } from "react-router-dom";

const Crousel = React.memo(() => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { carrousalData } = useContext(MainPageDataContext);
  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      7000 // Transition every 7 seconds
    );

    return () => clearInterval(intervalId);
  }, []);
  if (carrousalData.isLoading) {
    return <></>;
  }
  return (
    <Carousel
      interval={6000} /* Change slide every 8 seconds (3000 milliseconds) */
      className="hr-mb-10"
    >
      {carrousalData?.data?.map((item, index) => (
        <Carousel.Item
          key={index}
          onClick={() =>
            navigate("/product-section", {
              state: { name: item.subCategoryName, id: 2 },
            })
          }
        >
          <div className="carousel-adj d-flex align-items-center ">
            <img className="carrousal-img" src={item.image} alt="Slide 1"  loading="lazy"/>
            <div className="center-caption">
              <h1>
                {item.brandName.toUpperCase()}{" "}
                {item.subCategoryName.toUpperCase()}
              </h1>
              <button>Shop Now</button>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
  // );
});
export default Crousel;
