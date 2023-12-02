import "../index.css";
import bgImage from "./productimage.webp";
import { useNavigate } from "react-router-dom";
export default function ProductCard({ item }) {
  const navigate=useNavigate();
  function Navigator(){
      console.log("The id is ", item.productId);
      navigate('/product-detail',{state:{id:item.productId}})
      
  }
  return (
    <div  onClick={Navigator}>
      <div
        className="product-card-container"
        style={{
          backgroundImage: `url(${item.images[0]})`,
          backgroundPosition: "center Top",
          backgroundSize: "cover",
          objectFit: "center",
        }}
      >
        {item.stockCount === 0 && (
          <span style={{ fontSize: "12px" }}>Sold Out</span>
        )}
      </div>

      <p
        style={{
          fontSize: "12px",
          fontWeight: "light",
          marginBottom: "0.5vh",
          color: "#454545",
          marginTop: "0.5vh",
        }}
      >
        {item.productTitle}
      </p>

      <div className="price-container">
        <p style={{ fontSize: "12px" }}>Rs.{item.productPrice}</p>
        {item.discountPrice > 0 && (
          <p style={{ fontSize: "10px" }}>
            Rs.<del>{item.discountPrice}</del>
          </p>
        )}
      </div>
    </div>
  );
}
