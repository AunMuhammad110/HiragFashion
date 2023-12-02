import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "./navbar.css";
import NavBar from "./nav";
import logo from "./hg2r.png";
import MainPageDataContext from "../GlobalData/MainPage";
import { useNavigate } from "react-router-dom";
const Navbarr = React.memo(() => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useContext(MainPageDataContext);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [smallImagesVisible, setSmallImagesVisible] = useState(true);
  if (isLoading) {
    return <p> Loading .... </p>;
  }
  if (isError) {
    return <p>Error....</p>;
  }
  const brandItems = [
    "AFROZEH",
    "ANSAB JAHANGIR",
    "ASIFA & NABEEL",
    "ASIFA & NABEEL BELLA CAMBRIC 2022",
    "ASIFA AND NABEEL LILIBET LUXURY LAW-2022",
    "ASIFA & NABEEL ALEYNA SUMMER VOL 1 2023",
    "ANAYA VIRSA",
    "CHARIZMA",
    "CRIMSON",
    "ELAF",
    "EZRA WEDDING COLLECTION 2022",
    "FARAH TALIB AZIZ",
    "GIESELE",
    "KAHAF PREMIUM",
    "HUSSAIN REHAR",
    "IZNIK",
    "KANWAL MALIK",
    "MARIA.B",
    "MARYAM HUSSAIN",
    "MALIKA SHAHNAZ",
    "MUSHQ",
    "MOHSIN NAVEED RANJHA",
    "NOOR BY SADIA ASAD",
    "NUREH",
    "QALAMKAR",
    "REPUBLIC WOM",
  ];

  
  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };
  function Navigator(name, id,e){
    e.preventDefault();
    navigate('/product-section',{state:{name: name, id:id}})
  }

  return (
    <>
      {smallImagesVisible && <NavBar />}

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid d-flex">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon custom"></span>
          </button>

          {/* Logo */}
          <div className="d-flex">
            <a className="navbar-brand padd" href="#">
              <img className="logoS " src={logo} alt="logo" onClick={()=>{navigate('/')}}/>
            </a>
          </div>
          <div className="my-2 mx-2 my-lg-0 seq-ord">
            <a href="#" className="p-2">
              <i
                className="fas fa-search"
                id="bag-Icon"
                onClick={toggleSearch}
              ></i>
              {isSearchOpen && (
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search..."
                  onBlur={() => setSearchOpen(false)}
                />
              )}
            </a>
            <a href="#" className="p-2">
              <i className="fa fa-heart-o" id="bag-Icon" aria-hidden="true"></i>
            </a>

            <a href="#" className="p-2">
              <i
                className="fas fa-shopping-cart"
                id="bag-Icon"
                aria-hidden="true"
              ></i>
            </a>
          </div>

          {/* All the tags */}
          <div
            className="collapse navbar-collapse seq-ord-2"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mr-auto pl-4">
              <li className="nav-item dropdown pl-md-2">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  NEW IN
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {data[1][1]["New Collection"].map((item, index) => (
                    <a
                      onClick={() => Navigator(item.subBrandName, 2,event)}
                      className="dropdown-item"
                      key={index}
                      href="#"
                    >
                      {item.subBrandName}
                    </a>
                  ))}
                </div>
              </li>
              <li className="nav-item dropdown pl-md-2">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  SUMMER
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {data[1][2]["Summer Collection"].map((item, index) => (
                    <a
                      onClick={() => Navigator(item.subBrandName, 2, event)}
                      className="dropdown-item"
                      key={index}
                      href="#"
                    >
                      {item.subBrandName}
                    </a>
                  ))}
                </div>
              </li>
              <li className="nav-item dropdown pl-md-2">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  WINTER
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {data[1][3]["Winter Collection"].map((item, index) => (
                    <a
                      onClick={() => Navigator(item.subBrandName, 2,event)}
                      className="dropdown-item"
                      key={index}
                      href="#"
                    >
                      {item.subBrandName}
                    </a>
                  ))}
                </div>
              </li>

              {/* shops by brands */}
              <li className="nav-item dropdown pl-md-2">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  SHOP BY BRANDS
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {data[0].map((item, index) => (
                    <a
                      onClick={() => Navigator(item.brandName, 1,event)}
                      className="dropdown-item"
                      key={index}
                      href="#"
                    >
                      {item.brandName}
                    </a>
                  ))}
                </div>
              </li>

              <li className="nav-item dropdown pl-md-2">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  WEDDING COLLECTION
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {data[1][0]["Wedding Collection"].map((item, index) => (
                    <a
                      onClick={() => Navigator(item.subBrandName, 2,event)}
                      className="dropdown-item"
                      key={index}
                      href="#"
                    >
                      {item.subBrandName}
                    </a>
                  ))}
                </div>
              </li>
              <li className="nav-item dropdown pl-md-2">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  SALE
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {data[1][4]["Sale"].map((item, index) => (
                    <a
                      onClick={() => Navigator(item.subBrandName, 2,event)}
                      className="dropdown-item"
                      key={index}
                      href="#"
                    >
                      {item.subBrandName}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {!smallImagesVisible && <NavBar />}
    </>
    //
    // </>
  );
});

export default Navbarr;
