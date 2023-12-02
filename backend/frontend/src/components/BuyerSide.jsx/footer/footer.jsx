import React from "react";
import './footer.css';
import logo from './hg2r.png'

function Footer(){
    return(
        <>
        <footer>
        <div className="footer-wrap">
  <div className="container-fluid first_className">
    <hr className="ss"/>
      <div className="row">
    
        <div className="col-md-4 col-sm-6">
          <h2 className="sad">BE THE FIRST TO KNOW</h2>
          <p>Get all the latest information on launch of latest Collections, Sale New Arrival and many more. Sign up for our newsletter today.</p>
        </div>
        <div className="col-md-4 col-sm-6">
        <form className="newsletter">
           <input type="text" placeholder="Email Address"/> 
                                                        <button className="newsletter_submit_btn" type="submit"><i className="fa fa-paper-plane"></i></button>  
        </form>
        
        </div>
        <div className="col-md-4 col-sm-6">
        <div className="col-md-12">
          <div className="standard_social_links">
        <div>
          <li className="round-btn btn-facebook"><a href="#"><i className="fab fa-facebook-f"></i></a>

          </li>
          <li className="round-btn btn-instagram"><a href="#"><i className="fab fa-instagram" aria-hidden="true"></i></a>

          </li>
          <li className="round-btn btn-whatsapp"><a href="#"><i className="fab fa-whatsapp" aria-hidden="true"></i></a>

          </li>
          <li className="round-btn btn-envelop"><a href="#"><i className="fa fa-envelope" aria-hidden="true"></i></a>
          </li>
        </div>
      </div>  
        </div>
          <div className="clearfix"></div>
        <div className="col-md-12"><h3>Stay Connected</h3></div>
        </div>
        <hr />
      </div>
  </div>
    <div className="second_className">
      <div className="container-fluid second_className_bdr">
      <div className="row">
        <div className="col-md-4 col-sm-6">

          <div className="footer-logo"><img src={logo} alt="logo" width='350px' height='200px'/>
          </div>
<p>One of the best clothing from where you can get all the brands, latest collection, wedding collection</p>        </div>
        <div className="col-md-4 col-sm-6">
          <h3>Quick  LInks</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a>
            </li>
            <li><a href="#">About us</a>
            </li>
            <li><a href="#">Contact Us</a>
            </li>
            <li><a href="#" target="_blank">Terms &amp; Conditions</a>
            </li>
            <li><a href="#">Share your views</a>
            </li>
          </ul>
        </div>
        <div className="col-md-4 col-sm-6">
          <h3>INFORMATION</h3>
          <ul className="footer-category">
            <li><a href="#" target="_blank">Privacy Policy</a>
            </li>
            <li><a href="#">Refund Policy</a>
            </li>
            <li><a href="#">Custom Tailoring</a>
            </li>
            <li><a href="#">FAQ's</a>
            </li>
          </ul>
          <div className="clearfix"></div>
        </div>
            <div className="copyright"> @Copyright 2023 | All Right Reserved and developed by Auniz Tech Innovators</div>
            </div>
        {/* <div className="col-md-3 col-sm-6">
          <h3>triedge Events</h3>
          <ul className="footer-links">
            <li><a href="#">Triedge Events</a>
            </li>
            
            <li><a href="#">Jobs &AMP; Internship Fair 2019</a>
            </li>
          </ul>
        </div> */}
      </div>
      
    </div>
    </div>
    
    <div className="row">
      <div className="container">
      
    </div>
  </div>
        {/* <div classNameName="container-fluid">
            <div classNameName="row d-flex flex-md-row flex-column">
            <div classNameName="col-4 py-0">
                <h2 classNameName="border-bottom pb-1 mb-3 border-dark ">INFORMATION</h2>
                <ul classNameName="list-unstyled" >
                    <li classNameName="bg-warning"><a href="#" classNameName="text-decoration-none text-dark">Terms and Condition</a></li>
                    <li><a href="#" classNameName="text-decoration-none text-dark" >Privacy Policy</a></li>
                    <li><a href="#" classNameName=" text-dark text-decoration-none">Shipping Policy</a></li>
                    <li><a href="#" classNameName="text-dark text-decoration-none">Custom Tailoring</a></li>
                    <li><a href="#" classNameName="text-dark text-decoration-none">Refund Policy</a></li>
                    <li><a href="#"classNameName="text-dark text-decoration-none">FAQ's</a></li>
                </ul>
            </div>
            <div classNameName="col-4">
                <h2 classNameName="border-bottom pb-1 mb-3 border-dark ">IMPORTANT LINKS</h2>
                <ul classNameName="list-unstyled" >
                    <li classNameName="bg-warning"><a href="#" classNameName="text-decoration-none text-dark">About Us</a></li>
                    <li><a href="#" classNameName="text-decoration-none text-dark" >Contact Us</a></li>
                    <li><a href="#" classNameName=" text-dark text-decoration-none">Give Us feedback</a></li>
                    
                </ul>
            </div>
            <div classNameName="col-4">
            <h2 classNameName="border-bottom pb-1 mb-3 border-dark ">NEWSLETTER</h2>
            </div>
            </div>
        </div> */}
        </footer>
        </>);
}

export default Footer;