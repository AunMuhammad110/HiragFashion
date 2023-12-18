import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";
import "./index.css";
import ScrollToTop from "./components/Customhooks/scrolltotop";
ReactDOM.createRoot(document.getElementById("root")).render(

  <BrowserRouter>
  <App />

</BrowserRouter>
);
