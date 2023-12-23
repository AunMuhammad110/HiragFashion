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
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  });
  const mainPageProducts = query("MainPageProducts", async () => {
    try {
      const response = await axiosClient.get("/buyerSide/GetSaleProducts");
      return response.data;
    } catch (error) {
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
