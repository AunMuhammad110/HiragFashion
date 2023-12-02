// import React from "react";
// import "../subBrandSection.css";
// import bgImage from "./img.webp";
// import { useNavigate } from "react-router-dom";

// export default function SubBrandCards(props) {
//   const navigate = useNavigate();
//   let image = props.image === null ? bgImage : props.image;
//   function Navigator(name, id, e) {
//     e.preventDefault();
//     navigate("/product-section", { state: { name: name, id: id } });
//   }

//   return (
//     <div
//       className="brand-card-container"
//       style={{
//         backgroundImage: `url(${image})`,
//         backgroundPosition: "center Top",
//         backgroundSize: "contain",
//         objectFit: "center",
//         backgroundRepeat: "no-repeat",
//         filter:"brightness(80%)"
//       }}
//       onClick={()=>{Navigator(props.subBrandName, props.id, event)}}
//     >
//       <p style={{ color: "white" }}>{props.subBrandName.toUpperCase()}</p>
//       <button>View All</button>
//     </div>
//   );
// }

import React from "react";
import "../subBrandSection.css";
import bgImage from "./img.webp";
import { useNavigate } from "react-router-dom";

export default function SubBrandCards(props) {
  const navigate = useNavigate();
  let image=props.image === null ? bgImage : props.image;

  function Navigator(name, id, e) {
    e.preventDefault();
    navigate("/product-section", { state: { name: name, id: id } });
  }

  return (
    <div
      className="brand-card-container"
      onClick={(event) => {Navigator(props.subBrandName, props.id, event)}}
    >
      <img
        src={image} // Use the provided image or a default one
        alt={"no image"}
        style={{
          width: "100%",  // Set the image to cover the entire container
          height: "100%", // Set the image to cover the entire container
          objectFit: "cover top",  // Maintain aspect ratio and cover the container
          filter: "brightness(70%)", // Adjust the brightness value as needed
        }}
      />
      {/* <div> */}
        <p style={{ color: "white" }}>{props.subBrandName.toUpperCase()}</p>
        <button>View All</button>
      {/* </div> */}
    </div>
  );
}