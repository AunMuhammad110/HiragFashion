import React, { createContext } from "react";
import axiosClient from "../../../apisSetup/axiosClient";
import { useRequestProcessor } from "../../../apisSetup/requestProcessor";

const MainPageDataContext = createContext();

export function MainDataProvider({ children }) {
  const { query } = useRequestProcessor();

  const { data, isLoading, isError }= query(
    "users",
    async () => {
      try {
        const response = await axiosClient.get("/buyerSide/GetCategories");
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  );
  const carrousalData = query("CarrousalData", async () => {
    try {
      const response = await axiosClient.get("/GetCarrousalDetails");
      console.log("The data is ");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  });
  const mainPageProducts = query("MainPageProducts", async () => {
    try {
      const response = await axiosClient.get("/buyerSide/GetSaleProducts");
      // console.log("data from context is ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error occured:");
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  });


  return (
    <MainPageDataContext.Provider value={{ data, isLoading, isError,carrousalData,mainPageProducts }}>
      {children}
    </MainPageDataContext.Provider>
  );
}

export default MainPageDataContext;
