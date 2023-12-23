import "../index.css";
// import bgImage from "./productimage.webp";
import { useNavigate } from "react-router-dom";


export default function ProductCard(data) {
  const {item,className,parentCollection}=data;
  const navigate = useNavigate();

  function Navigator() {
    navigate("/product-detail", { state: { id: item.productId,parentCollection:parentCollection}});
  }
  return (
    <div onClick={Navigator}>
      <div
        className={`product-card-container ${className}`}
        style={{
          backgroundImage: `url(${item?.images[0]})`,
          backgroundPosition: "center Top",
          backgroundSize: "cover",
          objectFit: "center",
        }}
      >
       {item.stockCount === 0 && <p className="sold-out-badge">Sold Out</p>}
      </div>

      <p className="product-title">{item.productTitle.toUpperCase()}</p>

      <div className="price-container">
        <p>Rs.{item.productPrice}</p>
        {item.discountPrice > 0 && (
          <div>
            <p>
              Rs.<del>{item.discountPrice}</del>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
