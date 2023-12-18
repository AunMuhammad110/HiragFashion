import { useCount } from "../GlobalData/cartContext/cartData"
import { useEffect, useState } from "react"

export default function CartIcon(){
    const {state}= useCount();
    const [cartCount, setCartCount] = useState();
    useEffect(()=>{
        let prevShoppingData =
        JSON.parse(window.localStorage.getItem("SHOPPING_DATA")) || [];
        setCartCount(prevShoppingData.length)
    },[state])

    return(

        <a href="#" className="p-2 parent-cart-alert">
        <i
          className="fas fa-shopping-cart"
          id="bag-Icon"
          aria-hidden="true"
        ></i>
        <span className="cart-alert">{cartCount}</span>
      </a>
    )
}