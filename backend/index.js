const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Import body-parser
// const UserModel = require('./models/users')
const path = require("path");
const { Console, log } = require("console");
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(express.json());
require("dotenv").config({ path: "data.env" });

// Increase request payload size limit to handle larger images
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
let ans = mongoose.connect("mongodb://localhost:27017/hiraGfashion");
let lastGeneratedProductId = "D0010199";

if (ans) {
  console.log("connected to the mongodb server");
  console.log("no mongodb server");
}

// // call the schema of product

// require('./schema/product.js')
require("./schema/product");
require("./schema/carrousalSettings");
require("./schema/notification");
require("./schema/deliveryPrice");
require("./schema/categoryDetails");
require("./schema/productImages")
// // creating product Schema Model
const Product = mongoose.model("Product");
const carrousalSettings = mongoose.model("CarrousalSettings");
const ProductNotification = mongoose.model("ProductNotification");
const DeliveryPricing = mongoose.model("DeliveryPricing");
const Brand = mongoose.model("BrandDetail");
const Images = mongoose.model("Images");
function generateUniqueProductId() {
  try {
    // Extract the letter and number parts from the last generated product ID.
    const letter = lastGeneratedProductId[0];
    let number = parseInt(lastGeneratedProductId.substring(1));

    // Increment the number.
    number++;

    // If the number reaches 9999999, move to the next letter.
    if (number > 9999999) {
      const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
      lastGeneratedProductId = nextLetter + "0000001";
    } else {
      // Format the number as a 7-digit string with leading zeros.
      const formattedNumber = number.toString().padStart(7, "0");
      lastGeneratedProductId = letter + formattedNumber;
    }

    return lastGeneratedProductId;
  } catch (e) {
    return { status: "error", data: e };
  }
}

// app.post('/upload-image', async (req, res) => {
//     const base64 = req.body.image;
//     try{
//         Image.create({image:base64});
//         res.send({Status:"ok"});
// // Generating Unique product ID

app.post("/signin", (req, res) => {
  const UserName = req.body.User_Name;
  const Password = req.body.Password;

  if (UserName === process.env.USERNAME && Password === process.env.PASSWORD) {
    // User is successfully signed in
    res.send("TrueTrue");
  } else {
    // User is not signed in
    res.send("FalseFalse");
  }
});

app.post("/AddCategory", async (req, res) => {
  const brandName = req.body.brandName.trim();

  // Check if the brand already exists in the collection
  const existingBrand = await Brand.findOne({ brandName });

  if (existingBrand) {
    return res.status(409).json({ message: "Brand already exists" });
  }

  // If the brand doesn't exist, create a new Brand document and save it
  const newBrand = new Brand({ brandName });

  try {
    const savedBrand = await newBrand.save();
    res.status(201).json({ message: "Brand saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving the brand" });
  }
});

app.post("/AddSubBrand", async (req, res) => {
  try {
    const brandName = req.body.data.brandName;
    const subBrandName = req.body.data.subBrandName;
    const collections = req.body.data.collections;

    if (!brandName || !subBrandName || !collections) {
      return res.status(400).json({ error: "Missing required data" });
    }

    // Find the brand with the specified brandName
    const brand = await Brand.findOne({ brandName });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Create a new subBrand object
    const subBrand = {
      subBrandName,
      collections,
    };

    // Push the subBrand to the subCategory array
    brand.subCategory.push(subBrand);

    // Save the brand document to update the subCategory array
    await brand.save();
    return res.status(201).json({ message: "Data has been added to category" });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// app.get('/get-image', async (req, res) => {

// // Update Category
app.post("/UpdateCategory", async (req, res) => {
  let previousCategoryName = req.body.previousCategoryName;
  let newCategoryName = req.body.newCategoryName;

  // Trim whitespace from the names
  previousCategoryName = previousCategoryName.trim();
  newCategoryName = newCategoryName.trim();

  try {
    // Check if the new category name already exists
    const categoryExists = await Brand.exists({ brandName: newCategoryName });

    if (categoryExists) {
      res.status(409).send("New Brand already exists");
    } else {
      // Define the filter to find the category with the previous name
      const filter = { brandName: previousCategoryName };

      // Define the update to set the new category name
      const update = { brandName: newCategoryName };

      // Use findOneAndUpdate to find and update the category and await the result
      const updatedCategory = await Brand.findOneAndUpdate(filter, update, {
        new: true,
      });

      if (!updatedCategory) {
        res.status(404).send("Previous Brand does not exist");
      } else {
        res.status(200).json("Brand successfully Updated");
      }
    }
  } catch (err) {
    res.status(500).send("Error while updating category: " + err.message);
  }
});

app.put("/UpdateSubCategoryList", async (req, res) => {
  const { brandName, prevSubBrandName, data } = req.body;

  try {
    // Remove the element with prevSubBrandName
    const pullFilter = { brandName };
    const pullUpdate = {
      $pull: { subCategory: { subBrandName: prevSubBrandName } },
    };
    const pullResult = await Brand.updateOne(pullFilter, pullUpdate);

    if (pullResult.nModified === 0) {
      return res.status(404).json({ message: "SubBrand not found" });
    }

    // Add the new element
    const pushFilter = { brandName };
    const pushUpdate = {
      $push: {
        subCategory: {
          subBrandName: data.subBrandName,
          collections: data.collections,
        },
      },
    };
    await Brand.updateOne(pushFilter, pushUpdate);

    return res
      .status(200)
      .json({ message: "SubCategory updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Remove the category
app.post("/RemoveCategory", async (req, res) => {
  const categoryName = req.body.categoryName.trim(); // Trim whitespace from the name

  try {
    // Define the filter to find the category with the given name
    const filter = { brandName: categoryName };

    // Use findOneAndDelete to find and delete the category and await the result
    const deletedCategory = await Brand.findOneAndDelete(filter);

    if (!deletedCategory) {
      res.status(404).send("Brand Name not found");
    } else {
      res.status(200).json("Brand Has been deleted");
    }
  } catch (err) {
    res.status(500).send("Error while removing category: " + err.message);
  }
});
app.post("/RemoveSubCategory", async (req, res) => {
  const brandName = req.body.brandName;
  const subBrandName = req.body.subBrandName;
  try {
    // Define the filter to find the brand with the given name
    const filter = { brandName };

    // Define an update operation to remove the subCategory with the specified subBrandName
    const update = {
      $pull: { subCategory: { subBrandName } },
    };

    // Use findOneAndUpdate to find and update the brand
    const updatedBrand = await Brand.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!updatedBrand) {
      return res.status(404).send("Brand not found");
    }

    res.status(200).json("SubBrand has been removed successfully");
  } catch (err) {
    res.status(500).send("Error while removing SubBrand: " + err.message);
  }
});

// // fetch and send categories to the client

app.get("/GetCategories", async (req, res) => {
  try {
    const categories = await Brand.find({}, "brandName");
    const categoryNames = categories.map((product) => product.brandName); // Use 'brandName' here
    const uniqueCategoryNames = [...new Set(categoryNames)]; // Remove duplicates if any
    res.json(uniqueCategoryNames);
  } catch (error) {
    console.error("Error while fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/GetSubCategoryList", async (req, res) => {
  const brandName = req.body.brandName;

  try {
    // Search for the brand by brandName
    const brand = await Brand.findOne({ brandName });

    if (!brand) {
      // Brand not found
      return res.status(404).json({ error: "Brand not found" });
    }

    // Access the subCategory array
    const subCategory = brand.subCategory;

    // Log the subCategory to the console

    // Send subCategory in the response
    res.status(200).json({ subCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//   Upload Product
app.post("/UploadProduct", async (req, res) => {
  try {
    const { productformData, image1 } = req.body;
    productformData.productName = productformData.productName.trim();
    const generatedProductId = generateUniqueProductId();

    // Check if a product with the same productId already exists
    const existingProduct = await Product.findOne({
      productId: generatedProductId,
    });

    if (existingProduct) {
      // Product with the same productId already exists
      return res.status(409).json({ message: "Product already exists" });
    }

    // Prepare the product object to be inserted into the database
    const newProduct = {
      productId: generatedProductId,
      brandName: productformData.category,
      productTitle: productformData.productName,
      productDetails: productformData.productDetails,
      productPrice: productformData.price,
      discountPrice: productformData.discountPrice,
      stockCount: productformData.stock,
      subBrandName: productformData.subBrandName,
      images: [],
    };

    // Add image1 to the product
    newProduct.images.push(image1);

    // Save the new product to the database
    const result = await new Product(newProduct).save();

    if (!result) {
      return res.status(404).json({ message: "Request failed with code 404" });
    }

    return res.status(200).json("Product Uploaded Successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/UploadImages", async (req, res) => {
  const productId=lastGeneratedProductId;
  const {  image2, image3 } = req.body;

  try {
    // Create a new Images document
    const imagesData = new Images({
      productId,
      images: [image2, image3].filter(Boolean), // Filter out any falsy values (null, undefined, etc.)
    });

    // Save the new Images document to the database
    const savedImages = await imagesData.save();

    // Respond with a success message
    res.status(200).json({ message: 'Images uploaded successfully' });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/GetProduct", async (req, res) => {
  const productId = req.body.productId;

  try {
    // Query the database to find the product by productId in the Product model
    const product = await Product.findOne({ productId: productId });

    if (!product) {
      // If the product is not found in the Product model, return a 404 response indicating that the product does not exist
      return res.status(404).send("Product not found");
    }

    // Search for images in the Images model based on productId
    const imagesData = await Images.findOne({ productId: productId });

    if (imagesData) {
      // If images are found in the Images model, push them to the product's images array
      product.images.push(...imagesData.images);
    }

    // Send the product data to the front end
    res.status(200).json(product);
  } catch (error) {
    console.error("Error while fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/UpdateProduct", async (req, res) => {
  const { productId, images, productformData } = req.body;
  try {
    // Search for the product with the given productId
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.images = images;
    product.brandName = productformData.brandName;
    product.productTitle = productformData.productName;
    product.productPrice = productformData.price;
    product.discountPrice = productformData.discountPrice;
    product.stockCount = productformData.stock;
    product.productDetails = productformData.productDetails;
    product.subBrandName = productformData.subBrandName;
    // Save the updated product
    await product.save();
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error while updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/GetProductToDelete", async (req, res) => {
  try {
    const { productId } = req.body;

    // Use the Product model to find the product by productId
    const product = await Product.findOne({ productId: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the product details based on the productId
    const productDetails = product;

    // Extract only the required fields and send them to the frontend
    const response = {
      productTitle: productDetails.productTitle,
      productPrice: productDetails.productPrice,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/DeleteProduct", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Use the Product model to find and remove the product by productId
    const product = await Product.findOneAndDelete({ productId: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Use the Images model to find and remove images by productId, if they exist
    const images = await Images.findOneAndDelete({ productId: productId });

    let deletionMessage = "Product deleted successfully";

    if (images) {
      deletionMessage += " and associated images deleted successfully";
    }

    res.status(200).json({ message: deletionMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// Update Carrousal

app.post("/UpdateCarrousal", (req, res) => {
  const carrousalImage = req.body.carrousalImage;
  let categoryName = req.body.subcategoryName;
  const objId = req.body.objId;
  const brandName = req.body.brandName;
  categoryName = categoryName.trim();

  // Check if the category exists in the Product collection
  // You should perform the category check here and then update the carrousalSettings

  // Find and update the carrousalSettings document by objId
  carrousalSettings
    .findOneAndUpdate(
      { _id: objId },
      {
        image: carrousalImage,
        subCategoryName: categoryName,
        brandName: brandName,
      },
      { new: true }
    )
    .then((updatedCarrousal) => {
      if (!updatedCarrousal) {
        res.status(404).json({ message: "Carrousal Product does not exist" });
        return;
      }
      res
        .status(200)
        .json({ message: "Carrousal product updated successfully." });
    })
    .catch((error) => {
      console.error("Error updating carrousal product:", error);
      res.status(500).json({ message: "Failed to update carrousal product" });
    });
});

app.get("/GetCarrousalDetails", async (req, res) => {
  try {
    const carrousalDetails = await carrousalSettings.find({});
    res.json(carrousalDetails);
  } catch (error) {
    console.error("Error while fetching carrousal details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add Product Id
app.post("/AddNotification", async (req, res) => {
  const productId = req.body.changeProductId.trim();

  try {
    // Check if a product with the given productId exists in the Product schema
    const existingProduct = await Product.findOne({ productId: productId });

    if (existingProduct) {
      // Check if the productId exists in the ProductNotification collection
      const existingNotification = await ProductNotification.findOne({
        productId,
      });

      if (existingNotification) {
        res
          .status(400)
          .json({ error: "Product ID already exists in notifications" });
      } else {
        // Create a new productNotification document using the Mongoose model
        const newNotification = new ProductNotification({
          productId: productId,
          // You can add other fields related to product notifications here
        });

        // Save the document to the database
        await newNotification.save();

        res
          .status(201)
          .json({ message: "ProductNotification added successfully" });
      }
    } else {
      res.status(400).json({ error: "Product does not exist with that ID" });
    }
  } catch (err) {
    console.error("Error adding productNotification: " + err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/GetProductIds", async (req, res) => {
  try {
    // Find all product notification documents
    const productNotifications = await ProductNotification.find(
      {},
      "productId"
    );

    // Extract the productIds from the retrieved documents
    const productIds = productNotifications.map(
      (notification) => notification.productId
    );

    // Find the corresponding product details for each productId
    const productDetails = await Product.find({
      productId: { $in: productIds },
    });

    // Create an array of objects with productId, productName, and price
    const productObjects = productDetails.map((product) => ({
      productId: product.productId,
      productName: product.productTitle,
      price: product.productPrice,
    }));

    res.json(productObjects);
  } catch (error) {
    console.error("Error while fetching product data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/DeleteProductId", async (req, res) => {
  try {
    const productId = req.body.productId;

    // Use findOneAndDelete to find and delete the product by productId
    const deletedProduct = await ProductNotification.findOneAndDelete({
      productId,
    });

    if (deletedProduct) {
      // Product with the given productId found and deleted
      res
        .status(200)
        .json({ message: "Product deleted successfully", deletedProduct });
    } else {
      // Product with the given productId not found
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ADDING DELIVERY PRICING PRODUCT

app.post("/AddDeliveryPrice", async (req, res) => {
  const countryName = req.body.country;
  const firstKg = req.body.firstKg;
  const addKg = req.body.addKg;

  try {
    // Check if a record with the given country name already exists
    const existingCountry = await DeliveryPricing.findOne({ countryName });

    if (existingCountry) {
      // A record with the same country name already exists
      res.json({ message: "Country already exists" });
      return;
    }

    // Create and save a new country record
    const newDeliveryPricing = new DeliveryPricing({
      countryName,
      firstKg,
      addKg,
    });

    await newDeliveryPricing.save();
    res.json("Country delivery price added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add delivery pricing data" });
  }
});
// app.get('/getusers', (req, res) => {
//   UserModel.find({}).
//   then(result=> res.json(result))
//   .catch(err => res.json(err))
// })
app.get("/GetDeliveryDetails", (req, res) => {
  DeliveryPricing.find({})
    .then((data) => {
      res.json(data); // Send the data as the response
    })
    .catch((err) => {
      res.json(err); // Send the error as the response
    });
});

app.post("/UpdateCountry/:id", async (req, res) => {
  const countryId = req.params.id;

  // You can add validation to ensure `req.body` contains the expected fields here

  try {
    const updatedCountry = await DeliveryPricing.findByIdAndUpdate(
      countryId,
      {
        countryName: req.body.countryName,
        firstKg: req.body.firstKg,
        addKg: req.body.addKg,
      },
      { new: true } // Return the updated document
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    return res
      .status(200)
      .json({ message: "Country updated successfully", updatedCountry });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating country", error: error.message });
  }
});

app.delete("/DeleteCountry/:id", async (req, res) => {
  const countryId = req.params.id;

  try {
    const deletedCountry = await DeliveryPricing.findByIdAndRemove(countryId);

    if (!deletedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    return res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting country", error: error.message });
  }
});

app.listen(3334, () => {
  console.log("The Server is running on port 3334");
});
