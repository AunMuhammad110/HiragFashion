import MainPageDataContext from "../../GlobalData/MainPage";
import { useContext } from "react";
import SubBrandSection from "./subbrandSection";
import React from "react";
const SectionController =React.memo(()=>{
  const { data, isLoading, isError } = useContext(MainPageDataContext);
  if (isLoading) {
    return <p></p>;
    }

    const arrayShopByBrand=data[0].map((item)=>(
        {
            subBrandName:item.brandName,
            image:item.image
        }
    ))
    const objShopByBrand={
        "Shop By Brand":arrayShopByBrand
    }
  return (
    <>    
    <SubBrandSection data={objShopByBrand} key={200} id={1}/>    
      {data[1].map((item, index) => (
        <SubBrandSection data={item} key={index} id={2}/>
      ))}
    </>
  );
});

export default SectionController;