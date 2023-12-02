import React, { createContext, useState, useEffect, useContext } from "react";
import axiosClient from "../../../apisSetup/axiosClient";
import { useRequestProcessor } from "../../../apisSetup/requestProcessor";
const MainPageDataContext = createContext();

export function MainDataProvider({ children }) {
  const { query } = useRequestProcessor();
  const [mainPageData, setMainPageData] = useState({
    contextDAta: [],
    isLoading: true,
    isError: false,
  });

  const { data, isLoading, isError } = query(
    "users",
    () =>
      axiosClient.get("/buyerSide/GetCategories").then((res) => {
        // console.log("The response from carrousal is ", res.data);
        const tempObject = {
          data: res.data,
          isLoading: false,
          isError: false,
        };
        setMainPageData(tempObject);
      }),
    { enabled: true }
  );
  
  return (
    <MainPageDataContext.Provider value={mainPageData}>
      {children}
    </MainPageDataContext.Provider>
  );
}
export default MainPageDataContext;
