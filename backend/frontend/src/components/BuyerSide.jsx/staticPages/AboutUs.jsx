import React from "react";
import image from "../MainPage/Crousel/carrousal.jpeg";
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
          LAAM.pk is Pakistan’s one-stop fashion online store that is home to
          the country’s finest designer wear. The main aim behind this venture
          is to host various Pakistani designer, prêt, lifestyle and luxury
          brands under one roof where global customers can shop what they want
          to under the banner of LAAM. A user-friendly platform that helps you
          browse through over a thousand products in a matter of minutes.
        </p>

        <p className="hr-mt-20">
          LAAM is ensuring that our international clientele can gather on one
          platform and enjoy the best shopping experience of all time. You can
          shop from the giants of the fashion industry under the one umbrella
          moreover, our customer service is available 24/7 to help you out.
        </p>
        <p className="hr-mt-20">
          A one-stop couture shop for designer wear that is specifically
          designed to cater to the needs of modern women. LAAM has all the
          top-notch designers on board such as Ali Xeeshan, Saira Shakira, Zuria
          Dor, Tena Durani, Mohsin Naveed Ranjha and many more.
        </p>
      </div>
    </div>
  );
}
