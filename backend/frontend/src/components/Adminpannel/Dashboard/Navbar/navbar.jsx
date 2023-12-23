import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Create a CSS file for styling
export default function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
           {/* <MessageIcon sx={{ 'color': 'white','width':'25px' }}/>  */}
          <Link to="/admin/mainDashboard/contact">Contact Messages</Link>
        </li>
        <li className="dropdown">
          <Link>Product</Link>
          <div className="dropdown-content">
            <Link to="/admin/mainDashboard/uploadProduct">Upload Product</Link>
            <Link to="/admin/mainDashboard/updateProduct">Update Product</Link>
            <Link to="/admin/mainDashboard/deleteProduct">Delete Product</Link>
          </div>
        </li>
        <li>
          <Link to="/admin/mainDashboard/">Order</Link>
        </li>
        <li>
          <Link to="/admin/mainDashboard/carrousalSettings">Carrousal Settings</Link>
        </li>
        <li>
          <Link to="/admin/mainDashboard/deliveryprice">Delivery Rates</Link>
        </li>
        <li>
          <Link to="/admin/mainDashboard/notification">Notifications</Link>
        </li>
        <li>
          <Link to="/admin/mainDashboard/product-settings">Main Page</Link>
        </li>
        <li className="logout-button">
          <Link onClick={()=>window.location.reload()}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
}
