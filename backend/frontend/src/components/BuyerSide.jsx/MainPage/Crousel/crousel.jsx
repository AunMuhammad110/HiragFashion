import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "./carous.css";
import { useRequestProcessor } from "../../../../apisSetup/requestProcessor";
import image from './carrousal.jpeg'

const Crousel = () => {
  const { query } = useRequestProcessor();
  // Below usState for TextTransition
  const [index, setIndex] = useState(0);

  // Below useState for saving data for carrousel
  const [carrouselData, setCarrousalData] = useState([]);

  // UseEfffect is used for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3334/GetCarrousalDetails"
        );
        // console.log(response.data);
        setCarrousalData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);






  // below useEffect for text Transition
  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      7000 // Transition every 7 seconds
    );

    return () => clearInterval(intervalId);
  }, []);


  // const { data: users, isLoading, isError } = query(
  //   'users',
  //   () => axiosClient.get('/GetCarrousalDetails').then((res) => {res.data
  //   console.log("The response from carrousal is ", res.data);}),
  //   { enabled: true }
  // );

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error :(</p>;

  return (
    // <>
    // <h1>This is Carrousal </h1>
    // </>
    <Carousel
      interval={8000} /* Change slide every 8 seconds (3000 milliseconds) */
    className="hr-mb-10">
      {carrouselData.map((item) => (
        <Carousel.Item>
          <div className="carousel-adj d-flex align-items-center ">
            <img
              className="w-100 heightt"
              // Dear Auni.. you need to build logic of  this image (Static image is used) :(
              src={image}
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
    </Carousel>
  );
};
export default Crousel;