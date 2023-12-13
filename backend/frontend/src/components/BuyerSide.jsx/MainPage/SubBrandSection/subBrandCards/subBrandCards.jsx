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
      />
      {/* <div> */}
        <p >{props.subBrandName.toUpperCase()}</p>
        <button>View All</button>
      {/* </div> */}
    </div>
  );
}