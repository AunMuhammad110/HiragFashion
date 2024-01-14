import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCount } from '../GlobalData/cartContext/cartData';
// Create a context
const DataContext = createContext();

// Create a custom hook to use the context
export const useDataContext = () => {
  return useContext(DataContext);
};


// Create a provider component that fetches data and provides the context
export const DataProvider = ({ children }) => {
  const {state,dispatch}= useCount();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const setCartWithLocalStorage = () => {
    let newCartData = localStorage.getItem("SHOPPING_DATA");
    console.log("local storage data",JSON.parse(newCartData));
    console.log(newCartData)
    if (newCartData==null || newCartData==[]) {
      // console.log(productIds);
      return productIds;
    } else {
      return JSON.parse(newCartData)
    }
  }
  const [cart, setCart] = useState(setCartWithLocalStorage);
  // useEffect(()=>{
  //   localStorage.setItem("LProductDetails",productIds[1])
  // },[])


  // const addToCart = async (productId) => {
  //   // Simulating an asynchronous operation with setTimeout
  //   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  //   // Simulate an API call or other asynchronous logic
  //   await delay(1000);

  //   // Check if the product is already in the cart
  //   const existingProductIndex = cart.findIndex(item => item.productId === productId);

  //   if (existingProductIndex !== -1) {
  //     // Product already exists, increase quantity by 1
  //     const updatedCart = [...cart];
  //     updatedCart[existingProductIndex].quantity += 1;
  //     setCart(updatedCart);
  //   } else {
  //     // Product does not exist, add it to the cart with quantity 1
  //     setCart([...cart, { productId, quantity: 1 }]);
  //   }
  // };
  const removeFromCart = (productId) => {
    // Check if the product is in the cart
    const existingProductIndex = cart.findIndex(item => item.productId === productId);
    if (existingProductIndex !== -1) {
      // If quantity is more than 1, decrease quantity by 1
      if (cart[existingProductIndex].quantity > 1) {
        const updatedCart = [...cart];
        updatedCart[existingProductIndex].quantity -= 1;
        setCart(updatedCart);
        console.log("after removing the value is ",updatedCart)
        window.localStorage.setItem("SHOPPING_DATA",JSON.stringify(updatedCart));
      } else {
        // If quantity is 1, remove the product from the cart
        const updatedCart = cart.filter(item => item.productId !== productId);
        dispatch({type:"DECREMENT"});
        setCart(updatedCart);
      }
    }
  };

  const TotalCalculator = ()=> {
    if(data==[]){
      return 0
    }else{
    const grandTotal = data.reduce((total, item) => {
      // Validate each item in the array
      // if (typeof item !== 'object' || !('quantity' in item) || !('price' in item)) {
      //   throw new Error('Each item must be an object with "quantity" and "price" properties.');
      // }
      // Calculate subtotal for each item
      const subtotal = item.quantity * item._doc.productPrice;
  
      // Add subtotal to the total
      return total + subtotal;
    }, 0);
  
    return grandTotal;
  }}
  const NumberofProduct = () => {
    return cart.reduce((sum, obj) => sum + obj.quantity, 0);
  }
  // console.log("The total number of product"+NumberofProduct())
  const WeightCalculator = () =>{
    const grandTotalWeight = data.reduce((total, item) => {
      const subtotal = item.quantity * item._doc.productWeight;
  
      // Add subtotal to the total
      return total + subtotal;
    }, 0);
    return parseFloat(grandTotalWeight.toFixed(2));
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (cart.length !== 0) {
          console.log(cart)
          const response = await axios.post("http://localhost:3334/GetProducts", cart);
          // console.log(response)
          setData(response.data);
        }
        else {
          setData(0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    localStorage.setItem("SHOPPING_DATA", JSON.stringify(cart));

  }, [cart]);
  // console.log("Updated data:", data + loading);


  return (
    <DataContext.Provider value={{ data, loading, removeFromCart,TotalCalculator,WeightCalculator,NumberofProduct }}>
      {children}
    </DataContext.Provider>
  );
};
