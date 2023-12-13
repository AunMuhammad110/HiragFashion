const express = require("express");
const mongoose = require("mongoose");
// require("/Users/aunmuhammad/Documents/HiragFashion/backend/schema/product.js");
require("../schema/product.js");
// require("/Users/aunmuhammad/Documents/HiragFashion/backend/schema/categoryDetails.js");\
require("../schema/categoryDetails.js")
// require("../schema/productImages.js")
require("../schema/notification")
// require("../")
const router = express.Router();
const Brand = mongoose.model("BrandDetail");
const Product = mongoose.model("Product");
// const Images=mongoose.model("Images");
const ProductNotification = mongoose.model("ProductNotification");

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
      "Sale",
      "New Collection",
      "Summer Collection",
      "Winter Collection",
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
  const parentCollection = req.query.parentCollection;
  try {
    // Fetch the main product details
    const product = await Product.findOne({ productId: productId }).lean();
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Determine the key based on parentCollection
    let key;
    if (parentCollection.id == 1) {
      key = "brandName";
    } else {
      key = "subBrandName";
    }

    // Fetch related products based on the dynamic key
    const relatedProducts = await Product.find({
      [key]: product[key],
      productId: { $ne: productId }
    }).limit(4).lean();

    // Extract the first index image from the images array of each related product
    const relatedProductsModified = relatedProducts.map((relatedProduct) => {
      const firstImage = relatedProduct.images && relatedProduct.images.length > 0
        ? relatedProduct.images[0]
        : null;
      return { ...relatedProduct, firstImage };
    });

    let pd = product.productDetails.split("<br>");
    const customObject = { ...product, splitProductDetails: pd, relatedProducts: relatedProductsModified };
    res.status(200).json(customObject);
  } catch (error) {
    console.error("Error while fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});







router.get("/GetNotifications", async(req, res) => {
  try {
    // Find all product notification documents
    const productNotifications = await ProductNotification.find({}, "productId");

    // Extract the productIds from the retrieved documents
    const productIds = productNotifications.map((notification) => notification.productId);

    // Find the corresponding product details for each productId
    const productDetails = await Product.find({ productId: { $in: productIds } });

    // Create an array of objects with productId, productName, price, and image
    const productObjects = productDetails.map((product) => ({
      productId: product.productId,
      productName: product.productTitle,
      brandName: product.brandName,
      image: product.images && product.images.length > 0 ? product.images[0] : null, // Get the image from index 0
    }));
    res.json(productObjects);
  } catch (error) {
    console.error("Error while fetching product data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/GetSaleProducts",async(req, res) => {  
  const categories = await Brand.find({});
  let subBrandName;
  let subBrandName2;
  categories.some((category) => {
    return category.subCategory.some((sub_category) => {
      return sub_category.collections.some((collectionItem) => {
        if (collectionItem === "Sale") {
          subBrandName = sub_category.subBrandName; // This breaks out of the some loop
        }
        else if (collectionItem === "New Collection") {
          subBrandName2=sub_category.subBrandName;
        }
      });
    });
  });
  const products = await Product.find({subBrandName:subBrandName});
  const products2 = await Product.find({subBrandName:subBrandName2});
  const objectToSend={subBrandDetails:[{subBrandName:subBrandName, id:2, productData:products}, {subBrandName:subBrandName2, id:2,productData:products2}]}
  res.json(objectToSend);
});

module.exports = router;
