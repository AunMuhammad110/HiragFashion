import NotificationCard from "./notification";
import axiosClient from "../../../apisSetup/axiosClient";
import React, { useEffect, useRef, useState } from "react";

export default function NotificationController() {
  const notificationDataRef = useRef();
  const count = useRef(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showNothing, setShowNothing]=useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/buyerSide/GetNotifications");
        notificationDataRef.current = res.data;
        if(res.data.length===0){
          setShowNothing(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if(showNothing){
      return;
    }
    const intervalId = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        if (count.current === notificationDataRef.current.length - 1) {
          count.current = 0;
        } else {
          count.current = count.current + 1;
        }
      }, 3000);
    }, 12000);
    return () => clearInterval(intervalId);
  }, []);
  const CloseAdd =() =>{
    setShowNotification(false)
} 
  // if(notificationDataRef.results.length ===0){
  //   return(
  //     <></>
  //   )
  // }  
  setTimeout(()=>{
      if(notificationDataRef.current?.length ===0){
        return(
          <></>
        )
      }
  },1000)
  if(showNothing){
    return(
      <></>
    )
  }
  return (
    <>
      {showNotification && (
        <NotificationCard
          brandName={notificationDataRef.current[count.current].brandName}
          productTitle={notificationDataRef.current[count.current].productName}
          image={notificationDataRef.current[count.current].image}
          productId={notificationDataRef.current[count.current].productId}
          CloseFun={CloseAdd}
        />
      )}{" "}
    </>
  );
}
