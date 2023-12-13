import ProductCard from "../../ProductSection/brandCards/brandCards";
import axiosClient from "../../../../apisSetup/axiosClient";
import { useRequestProcessor } from "../../../../apisSetup/requestProcessor";
export default function MainPageProducts() {
  const { query } = useRequestProcessor();
  const {
    data: productsData,
    isLoading,
    isError,
  } = query(
    "MAINPRODUCTS",
    () =>
      axiosClient.get("/buyerSide/GetSaleProducts").then((res) => {
        return res.data;
      }),
    { enabled: true }
  );
  return (
    <>
      {productsData ? (
        <div>
          <div className="sub-brand-section">
            <p style={{ textAlign: "center" }}> FEATURED PRODUCTS </p>
            <div className="grid-container">
              {productsData["subBrandDetails"][0]["productData"].map((item, index) => {
                return (
                  <ProductCard
                    item={item}
                    key={index}
                    className={"change-height"}
                  />
                );
              })}
            </div>
          </div>
          <div className="sub-brand-section">
            <p style={{ textAlign: "center" }}> {productsData["subBrandDetails"][1]["subBrandName"].toUpperCase()} </p>
            <div className="grid-container">
              {productsData["subBrandDetails"][1]["productData"].map((item, index) => {
                return (
                  <ProductCard
                    item={item}
                    key={index}
                    className={"change-height"}
                  />
                );
              })}
            </div>
          </div>
  
        </div>
      ) : null}
    </>
  );
}
