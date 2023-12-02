import React,{useEffect,useState} from "react";
import './nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
// // 
function NavBar(){



  const [smallImagesVisible, setSmallImagesVisible] = useState(true);

  useEffect(() => {
    // Check the screen width and hide small images on mobile screens
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSmallImagesVisible(false);
      } else {
        setSmallImagesVisible(true);
      }
    };

    // Add an event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initial check when the component mounts
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
    return(<>


   <div className="w-100 bg-black text-white container-fluid custom-height" style={{backgroundColor:"black"}}>
    <div className="row">
      {smallImagesVisible && (<div className="col-4 d-flex justify-content-center d-none d-sm-none d-md-flex  d-lg-flex d-xl-flex d-xxl-flex
        " >
            <div className="icoons">
                <FontAwesomeIcon icon={faFacebook}/></div>
                <div className="icoons">
            <FontAwesomeIcon icon={faInstagram}/></div>
        </div>)}
        {smallImagesVisible && (<div className="col-4 d-flex justify-content-center responsive-element">
            <p className="liner">Welcome to Hira G.Fashion</p>
</div>)}
{!smallImagesVisible && (<div className="col-12 d-flex justify-content-center responsive-element">
            <p className="liner">Welcome to Hira G.Fashion</p>
</div>)}
        {smallImagesVisible && (<div className="col-4 d-flex justify-content-center d-none d-sm-none d-md-flex  d-lg-flex d-xl-flex d-xxl-flex">
    <p className="liner">
        WhatsApp No. +92 349207137&nbsp;
        naveedmoiz928@gmail.com
    </p>
</div>)}


    </div>
   </div>

</>);}
export default NavBar;