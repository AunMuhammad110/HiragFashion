import React, { createContext, useContext, useReducer } from 'react';

// Create a context with initial state and a reducer function
const CountContext = createContext();

// Initial state for the context
const initialState = { count:0};

// Reducer function to handle different actions
if(window.localStorage.getItem("SHOPPING_DATA")){
  initialState.count=JSON.parse(window.localStorage.getItem("SHOPPING_DATA")).length;
  console.log("the length is " + initialState.count)
}


const countReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// Custom hook to provide the context and state to components
const useCount = () => {
  const context = useContext(CountContext);
  if (!context) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
};

// CountProvider component to wrap your application with
const CountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(countReducer, initialState);

  return (
    <CountContext.Provider value={{ state, dispatch }}>
      {children}
    </CountContext.Provider>
  );
};

export { CountProvider, useCount };
