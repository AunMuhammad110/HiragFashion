import { useContext } from "react";
import { useRequestProcessor } from "../../../../apisSetup/requestProcessor";
import MainPageDataContext from "../../GlobalData/MainPage";
import ProductCard from "../../ProductSection/brandCards/brandCards";
export default function MainPageProducts() {
  const {
    mainPageProducts: { data, isLoading, isError },
  } = useContext(MainPageDataContext);
  if (isLoading) {
    return <></>;
  }
  return (
    <>
      {data ? (
        <div>
          <div className="sub-brand-section">
            <p style={{ textAlign: "center" }}> FEATURED PRODUCTS </p>
            <div className="grid-container">
              {data["subBrandDetails"][0]["productData"].map((item, index) => {
                return (
                  <ProductCard
                    item={item}
                    key={index}
                    className={"change-height"}
                    parentCollection={{name:item.subBrandName, id:2}}
                  />
                );
              })}
            </div>
          </div>
          <div className="sub-brand-section">
            <p style={{ textAlign: "center" }}>
              {" "}
              {data["subBrandDetails"][1]["subBrandName"].toUpperCase()}{" "}
            </p>
            <div className="grid-container">
              {data["subBrandDetails"][1]["productData"].map((item, index) => {
                return (
                  <ProductCard
                    item={item}
                    key={index}
                    className={"change-height"}
                    parentCollection={{name:item.subBrandName, id:2}}
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
