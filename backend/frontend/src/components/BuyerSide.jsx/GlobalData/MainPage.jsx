import React, { createContext } from "react";
import axiosClient from "../../../apisSetup/axiosClient";
import { useRequestProcessor } from "../../../apisSetup/requestProcessor";

const MainPageDataContext = createContext();

export function MainDataProvider({ children }) {
  const { query } = useRequestProcessor();

  const { data, isLoading, isError } = query(
    "users",
    async () => {
      try {
        const response = await axiosClient.get("/buyerSide/GetCategories");
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Propagate the error for React Query to handle
      }
    },
    {
      staleTime: 60000,
    }
  );

  return (
    <MainPageDataContext.Provider value={{ data, isLoading, isError }}>
      {children}
    </MainPageDataContext.Provider>
  );
}

export default MainPageDataContext;
