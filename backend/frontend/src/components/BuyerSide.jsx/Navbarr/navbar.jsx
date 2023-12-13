import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import "./navbar.css";
import NavBar from "./nav";
import logo from "./hg2r.png";
import MainPageDataContext from "../GlobalData/MainPage";
import { useNavigate } from "react-router-dom";
const Navbarr = React.memo(() => {
  const navigate = useNavigate();
  const cartDataLength = useRef;
  const { data, isLoading, isError } = useContext(MainPageDataContext);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [smallImagesVisible, setSmallImagesVisible] = useState(true);
  useEffect(()=>{
    const shoppingData = JSON.parse(window.localStorage.getItem("SHOPPING_DATA"));
    if (shoppingData) {
    cartDataLength.current=shoppingData.length;
    }
  },[window.localStorage])

  if (isLoading) {
    return <p></p>;
  }
  if (isError) {
    return <p></p>;
  }
 
  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };
  function Navigator(name, id, e) {
    e.preventDefault();
    navigate("/product-section", { state: { name: name, id: id } });
  }

  return (
    <>
      {smallImagesVisible && <NavBar />}


      {!smallImagesVisible && <NavBar />}
    </>
    //
    // </>
  );
});

export default Navbarr;
