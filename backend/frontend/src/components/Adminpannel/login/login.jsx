import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./login.css";
import { Outlet,Navigate, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Login(props) {
    const navigate=useNavigate();
    const [isloggedin, setIsLoggedin] = useState(false);


  // validation of form

  const schema = yup.object().shape({
    User_Name: yup.string().required("User name is Required"),
    Password: yup.string().required(),
  });

  //   react hook form initializer

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const [showPassword, setShowPassword] = useState(false);

  //   handle submission of login request
  function onSubmit(data) {
    axios.post("http://localhost:3334/signin", { User_Name: data.User_Name, Password: data.Password }).then(
        (response) => {
            if (response.data == 'TrueTrue') {
                setIsLoggedin(true);
                navigate('/admin/mainDashboard');

            } else {
              alert("false statement")
                setIsLoggedin(false);
            }
        });

  
}
  function move(){
    alert("navigating to mainDashboard");
     // Navigate to the mainDashboard route
  }


  // ...

return (
  <div >
    {isloggedin ? (
      <Outlet />
    ) : (
        <div className="login-main-container">
          <div className="login-container">
        <h1 className="login-heading">Welcome to Hira G Fashion Admin Panel</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="Login-Form">
          <input
            type="text"
            placeholder="Enter User Name"
            required
            {...register("User_Name")}
            className="input-box"
          />
          <div className="password-wrapper">
            <input
              className="password-box input-box"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              required
              {...register("Password")}
            />
            <div className="eye-icon">
              {showPassword ? (
                <VisibilityOffIcon
                  onClick={() => setShowPassword(false)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <VisibilityIcon
                  onClick={() => setShowPassword(true)}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
          <input type="submit" className="input-button" />
        </form>
      </div>
        </div>

    )}
  </div>
);

}
