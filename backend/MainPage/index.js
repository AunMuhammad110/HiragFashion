const express = require("express");
const mongoose = require("mongoose");
// require("/Users/aunmuhammad/Documents/HiragFashion/backend/schema/product.js");
require("../schema/product.js");
// require("/Users/aunmuhammad/Documents/HiragFashion/backend/schema/categoryDetails.js");\
require("../schema/categoryDetails.js")
require("../schema/productImages.js")
// require("../")
const router = express.Router();
const Brand = mongoose.model("BrandDetail");
const Product = mongoose.model("Product");
const Images=mongoose.model("Images");

async function fetchAndAddImages(brandNamesArray) {
  const updatedBrandNamesArray = [];

  for (const brand of brandNamesArray) {
    try {
      const product = await Product.findOne({ brandName: brand.brandName })
        .skip(1)
        .limit(1);
      if (product && product.images && product.images.length > 0) {
        const image = product.images[0];
        const updatedBrand = { ...brand, image };
        updatedBrandNamesArray.push(updatedBrand);
      } else {
        image = null;
        const updatedBrand = { ...brand, image };
        updatedBrandNamesArray.push(updatedBrand);
      }
    } catch (error) {
      console.error(
        `Error fetching image for ${brand.brandName}: ${error.message}`
      );
    }
  }

  return updatedBrandNamesArray;
}

const updateArrayWithImages = async (collectionsArray) => {
  for (const collection of collectionsArray) {
    for (const key in collection) {
      const products = collection[key];

      for (const product of products) {
        const subBrandName = product.subBrandName;
        const foundProduct = await Product.findOne({ subBrandName });
        if (foundProduct) {
          product.image = foundProduct.images[0]; 
        }
        else{
          product.image =null;
        }
      }
    }
  }

  return collectionsArray;
};

router.get("/GetCategories", async (req, res) => {
  try {
    const categories = await Brand.find({});
    const brandNamesArray = categories.map((item) => ({
      brandName: item.brandName,
    }));
    const collectionsArray = [];
    const collections = [
      "Wedding Collection",
      "New Collection",
      "Summer Collection",
      "Winter Collection",
      "Sale",
    ];

    collections.forEach((collection) => {
      const collectionObj = {
        [collection]: [],
      };

      categories.forEach((item) => {
        item.subCategory.forEach((subItem) => {
          if (subItem.collections.includes(collection)) {
            collectionObj[collection].push({
              subBrandName: subItem.subBrandName,
            });
          }
        });
      });

      collectionsArray.push(collectionObj);
    });

    const resultArray = [];
    updateArrayWithImages(collectionsArray)
      .then((updatedArray) => {
      })
      .catch((error) => {
        console.error(error);
      });

      const [brands] = await Promise.all([
        fetchAndAddImages(brandNamesArray),
      ]);
      const [categoriesArray] = await Promise.all([
        updateArrayWithImages(collectionsArray),
        
      ]);
    resultArray.push(brands, categoriesArray);
    res.json(resultArray);
  } catch (error) {
    console.error("Error while fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post('/GetProducts', async (req, res) => {
  try {
      const { id, name } = req.body;
      
      if (id === 1) {
          // Fetch all products with the specified brandName
          const products = await Product.find({ brandName: name });
          res.json(products);
      } else {
          // Search for products with the specified subBrandName
          const products = await Product.find({ subBrandName: name });
          res.json(products);
      }
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/GetProductDetails/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findOne({ productId: productId }).lean();

    if (!product) {
      return res.status(404).send("Product not found");
    }
    const imagesData = await Images.findOne({ productId: productId }).lean();

    if (imagesData) {
      product.images.push(...imagesData.images);
    }
    let pd= product.productDetails.split("<br>");
    const customObject= {...product, splitProductDetails: pd}
    res.status(200).json(customObject);
  } catch (error) {
    console.error("Error while fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;


