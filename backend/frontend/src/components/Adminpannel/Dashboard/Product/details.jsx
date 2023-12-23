import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from '../../../../apisSetup/axiosClient';
const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [shouldFetch, setShouldFetch] = useState(true)
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    if(shouldFetch){
      axiosClient.get('/GetCategories')
      .then((result) => {
        setCategoryList(result.data);
      })
      .catch((error) => {
        toast.error('Failed to Fetch Categories');
      });
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  
  function CallData(){
    setShouldFetch(!shouldFetch);
  }
  const context={categoryList, CallData};

  return (
    <CategoryContext.Provider value={context}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryContext;
