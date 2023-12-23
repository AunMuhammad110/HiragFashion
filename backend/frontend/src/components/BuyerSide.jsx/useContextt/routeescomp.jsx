import React from 'react';
import CheckOut from '../Checkout/checkout';
import OrderForm from '../OrderForm/Form';
import ThankComp from '../OrderForm/ThankComp';
import { DataProvider } from './context'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
export default function SubTree() {
  return (<>
    <DataProvider>
      <Routes>
        <Route path='/chkout' element={<CheckOut />}></Route>
        <Route path='/orderform' element={<OrderForm />}></Route>
        <Route path='/thankcomp' element={<ThankComp/>}></Route>
       
      </Routes>
    </DataProvider>
  </>)
}