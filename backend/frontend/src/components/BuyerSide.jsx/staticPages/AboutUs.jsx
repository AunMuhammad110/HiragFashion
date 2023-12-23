import React, { useEffect, useLayoutEffect } from "react";
import image from "../MainPage/Crousel/carrousal.jpeg";
import { useLocation } from "react-router-dom";
// import image from "./staticPages/carousal.jpeg"
export default function AboutUs() {
  return (
    <div className="about-main-container">
      <div className="about-container">
        <h2>About HiragFashion</h2>
        <div>
        <img src={image} alt="about us image" />
        </div>
        <h1 className="text-center hr-mt-20" >ABOUT US</h1>
        <p className="hr-mt-20">
        Welcome to Hira G Fashions, your premier destination for exquisite fashion finds. Established in 2012, we are a leading multi-brand online shopping store based in Pakistan, offering a curated selection of premium designer collections from renowned brands to clients both globally and locally.
        </p>

        <h3>Our Journey</h3>

        <p className="hr-mt-20">
        With a foundation laid in 2012, Hira G Fashions has evolved into a fashion-forward haven, providing a seamless shopping experience to customers worldwide. We take pride in being at the forefront of the e-commerce landscape, consistently delivering the latest trends and timeless classics to your doorstep.
        </p>
        <h3>Global Reach, Local Charm:</h3>
        <p className="hr-mt-20">
        At Hira G Fashions, our reach knows no boundaries. While we operate globally, we remain deeply rooted in our local ethos. This duality allows us to offer a diverse range of products, blending international style with the rich cultural tapestry of Pakistan.
        </p>
        <h3>What Sets Us Apart:</h3>
        <p>We stand out in the crowded e-commerce space by not just offering products, but crafting an experience. Our commitment to excellence extends beyond the brands we carry; we provide customized stitching services to ensure that every piece you order fits you perfectly. With home delivery options, we bring the latest in fashion right to your doorstep.</p>
        <h3>Our Mission:</h3>
        <p>Our mission at Hira G Fashions is simple yet profound: to build a user-friendly space for people where they can access hundreds of designer brands under one roof. We are dedicated to providing the highest quality products and services locally and internationally. Through innovation and teamwork, we aspire to set new standards in the world of online shopping, creating a haven for fashion enthusiasts worldwide.</p>
        <p>Thank you for choosing Hira G Fashions. Explore, indulge, and make a statement with your style.</p>
        <p> --------- </p>
        <p>Feel free to customize this draft to better align with your brand's voice and style. If you have any specific points you'd like to emphasize or modify, let me know!</p>
      </div>
    </div>
  );
}
