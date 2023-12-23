const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mainPage=require("./MainPage/index")

const path = require("path");
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(express.json());
app.use('/MainPage', mainPage);
// require("dotenv").config({ path: "data.env" });


app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
let ans = mongoose.connect("mongodb://127.0.0.1:27017/hiraGfashion");
let lastGeneratedProductId = "D5361029";

if (ans) {
  console.log("connected to the mongodb server");
}
else{
  console.log("Not connected to the mongodb server");
}

// // call the schema of product

// require('./schema/product.js')
require("./schema/product");
require("./schema/carrousalSettings");
require("./schema/notification");
require("./schema/deliveryPrice");
require("./schema/categoryDetails");
require("./schema/productImages")
require("./schema/mainPageBrands")
require("./schema/ordertable")
require('./schema/feedBackform')

// // creating product Schema Model
const Product = mongoose.model("Product");
const carrousalSettings = mongoose.model("CarrousalSettings");
const ProductNotification = mongoose.model("ProductNotification");
const DeliveryPricing = mongoose.model("DeliveryPricing");
const Brand = mongoose.model("BrandDetail");
const Images = mongoose.model("Images");
const MainPageBrands=mongoose.model("mainPageBrands")
const Order = mongoose.model("Order");
const Feedback = mongoose.model("Feedback");

const buyerSide= require('./MainPage/index')
app.use("/buyerSide",  buyerSide);


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

app.post("/signin", (req, res) => {
  const UserName = req.body.User_Name;
  const Password = req.body.Password;

  if (UserName === "hiragfashion" && Password =="123") {
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
app.post("/DeleteCarrousal", async (req, res) => {
  const id= req.body.id;

  try {
    // Search for the brand by brandName
    const deleteData = await carrousalSettings.findByIdAndDelete(id);

    if (!deleteData) {
      // Brand not found
      return res.status(400).json({ error: "Carrousal Data not found" });
    }
    res.status(200).json({message:"Data Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
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

    res.status(200).json({ subCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/uploadProduct", async (req, res) => {
  try {
    const { productformData, image, productId } = req.body;
    const generatedProductId = productId.trim();

    const existingProduct = await Product.findOne({
      productId: generatedProductId,
    });

    if (existingProduct) {  
      return res.status(409).json({ message: "Product already exists" });
    }
    // console.log("the product category is ", productformData);
    // return res.status(200).json({ message: "Product Uploaded Successfully" });
    const newProduct = {
      productId: generatedProductId,
      brandName: productformData.category,
      productTitle: productformData.productName,
      productDetails: productformData.productDetails,
      productPrice: productformData.price,
      discountPrice: productformData.discountPrice,
      stockCount: productformData.stock,
      productWeight: productformData.productWeight,
      subBrandName: productformData.subBrandName,
      images: image,
    };

    const result = await new Product(newProduct).save();

    if (!result) {
      return res.status(404).json({ message: "Request failed with code 404" });
    }

    return res.status(200).json({ message: "Product Uploaded Successfully" });
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
    // Query the database to find const product = await Product.findOne({ productId: productId });the product by productId in the Product model
    const product = await Product.findOne({ productId: productId });

    if (!product) {
      // If the product is not found in the Product model, return a 404 response indicating that the product does not exist
      return res.status(404).send("Product not found");
    }
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
      images:productDetails.images
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
    const product = await Product.findOneAndDelete({ productId: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// Update Carrousal

app.post("/CreateCarrousal", (req, res) => {
  const carrousalImage = req.body.imageUrl; // Use req.file.path for the file path
  let categoryName = req.body.subcategoryName;
  const brandName = req.body.brandName;
  // categoryName = categoryName.trim();
  const newCarrousal = new carrousalSettings({
    image: carrousalImage,
    subCategoryName: categoryName,
    brandName: brandName,
  });
  newCarrousal
    .save()
    .then((createdCarrousal) => {
      res.status(201).json({ message: "Carrousal product created successfully", data: createdCarrousal });
    })
    .catch((error) => {
      console.error("Error creating carrousal product:", error);
      res.status(500).json({ message: "Failed to create carrousal product" });
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


app.post("/AddMainPageProducts", async (req, res) => {
  const { brandName, categoryName, category } = req.body;

  try {
    // Check if a document with the specified category already exists
    const existingCategory = await MainPageBrands.findOne({ category: category });

    if (existingCategory) {
      // If the category already exists, send an error response
      return res.status(400).json({ message: "Category 'Sale' already exists" });
    }

    // If the category doesn't exist, proceed to create a new document
    const response = await MainPageBrands.create({
      brandName: brandName,
      categoryName: categoryName,
      category: category,
    });

    if (response) {
      res.status(200).json({ message: "Successfully added" });
    } else {
      res.status(400).json({ message: "Error occurred while saving Product" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


app.post('/DeleteMainPageProducts', async (req, res) => {
  const {id}=req.body;
  try{
      const response = await MainPageBrands.findByIdAndDelete({_id:id});
      if (response) {
        res.status(200).json({message: "Successfully deleted"});
      }
      else{
        res.status(400).json({message: "Error occurred while deleting Product"});
      }
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
app.get('/GetMainPageProducts', async (req, res) => {
  try{
      const data = await MainPageBrands.find({});
      if (data) {
        res.status(200).json({message: "Successfully Retrieved",data:data});
      }
      else{
        res.status(400).json({message: "Error occured while finding product"});
      }
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// for feedback
app.post('/saveFeedback', async (req, res) => {
  try {
    const {FormData :{namee, mail, review}, rating}= req.body;
    console.log("the form  Data is ", FormData)
    console.log("The rating is ", rating)

    // console.log(req.body)
    // return;
    // const { namee, mail, review, rating } = req.body;

    // Create a new feedback entry
    const newFeedback = new Feedback({
      namee,
      mail,
      review,
      rating,
    });

    // Save the feedback to the database
    const savedFeedback = await newFeedback.save();

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getFeedbacks', async (req,res)=>{
  try{
    const response = await Feedback.find({});
    res.status(201).json(response);
  }catch(error){
    console.error(error);
  }
})
app.post('/delFeedback', async (req, res) => {
  try {
    const userEmail = req.body.mail; // Assuming email is in req.body.mail
    console.log(userEmail)

    // Check if the email is provided in the request body
    if (!userEmail) {
      return res.status(400).json({ error: 'Email not provided in the request body' });
    }

    // Attempt to find and delete the feedback entry by email
    const deletedFeedback = await Feedback.findOneAndDelete({ mail: userEmail });

    // Check if the feedback was found and deleted
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// below code is for order admit pnael

// From here the order api's begin
app.post('/orders', (req, res) => {
  // Create a new order document based on the request body
  const newOrder = new Order({
    orderId: req.body.orderId,
    clientName: req.body.clientName,
    NoProduct: req.body.NoProduct,
    Location: req.body.Location,
  }).save();
  if (!newOrder){return res.status(404).json({ message: "Error Occurred" })}
else{return res.status(200).json({message:"Order posted"})}
  // Save the new order to the database
});

app.get('/getOrder', async (req, res) => {
  try {
    const result = await Order.find({});

    // Check if the array is empty
    if (result.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    // Log more details about the error
    console.error('Error occurred:', error);

    // Return an error response
    return res.status(500).json({ message: "An error occurred" });
  }
});

app.get('/getorderbyid/:id', (req, res) => {
  const id=req.params.id;
  console.log(id)
  Order.find({orderId:id})
  .then(result=> res.json(result))
  .catch(err => res.json(err))
});



//this is used to delete order from the table
app.post("/DeleteOrder",async (req,res)=>{
  try{
    const id =req.body.orderId;
    console.log(id);
    const ordId= await Order.findOneAndDelete({orderId:id});
    let deletionMessage = "order deleted successfully";
    if(!ordId){
       console.log('nahi hoa')
      return res.status(400).json({message:"Error in Deletion"})
    }
     console.log('hogyaa delete')
    res.status(200).json({ message: deletionMessage });}
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})


const axios = require('axios');
app.post("/verify-token", async (req,res) => {
  const { reCAPTCHA_TOKEN, Secret_Key} = req.body;

  try {
    let response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${Secret_Key}&response=${reCAPTCHA_TOKEN}`);
    console.log(response.data);

    return res.status(200).json({
      success:true,
      message: "Token successfully verified",
      verification_info: response.data
    });
  } catch(error) {
    console.log(error);

    return res.status(500).json({
      success:false,
      message: "Error verifying token"
    })
  }
});


// below api is for order
const nodemailer = require("nodemailer")
const fs= require('fs');
const handlebars = require('handlebars');
const { emitWarning } = require("process");
// const { default: axiosClient } = require("./frontend/src/apisSetup/axiosClient");
//Dummy api to add data in the order database:((IT woyuld be change according to frontend implementation))
app.post('/addOrder', async (req, res) => {
  try {
    // Initialize variables from the request body
    const orderId = req.body.orderId;
    const clientFName = req.body.clientFName;
    const clientLName = req.body.clientLName;
    const Address = req.body.Address;
    const postalCode = req.body.postalCode;
    const PhoneNo = req.body.PhoneNo;
    const Image = req.body.PaymentSS;
    const NoProduct = req.body.NoOfProduct;
    const Location = req.body.Location;
    const email= req.body.email;
    const totalBill = req.body.totalBill;
    const productsInfo = req.body.productsInfo;
    const shipmentTotal = req.body.shipmentTotal;
    // console.log(req.body);
    // Create a new order document with the variables
    const newOrder = new Order({
      email:email,
      totalBill:totalBill,
      orderId:orderId,
      clientFName:clientFName,
      clientLName:clientLName,
      Address:Address,
      postalCode:postalCode,
      PhoneNo:PhoneNo,
      Image:Image,
      NoProduct:NoProduct,
      Location:Location,
      productsInfo:productsInfo
    });
//  console.log(newOrder)
    // Save the document to the database
    const savedOrder = await newOrder.save();
    // console.log(savedOrder)
    // console.log(shipmentTotal);
    res.status(201).json({message:"Order has been saved"});
    sendOrderConfirmationEmail(savedOrder,shipmentTotal)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding order' });
  }
});


async function sendOrderConfirmationEmail(orderDetails,shipmentT) {
  const { email, clientFName, clientLName, Address, Location, PhoneNo,postalCode,productsInfo,totalBill,orderId} = orderDetails;
  const shipmentTotal =  shipmentT;
  const templateSource = fs.readFileSync('./Emails/ordermail.handlebars', 'utf8');
  console.log(shipmentTotal);
  const template = handlebars.compile(templateSource);
  const currentDate=new Date();
  const respon = ( await fetchInfoOfProduct(productsInfo));
  
  // console.log(respon);
  const subTotal=totalBill-shipmentTotal;
  const data = {
    subject: "Order Confirmation",
    name: `${clientFName}`,
    address: Address,
    postalcode:postalCode,
    location: Location,
    phone: PhoneNo,
    arrayofobject:respon,
    totalbill:totalBill,
    orderid:orderId,
    orderdate:currentDate,
    shipmenttotal:shipmentTotal,
    subtotal:subTotal
  };
  // console.log(data);

  const htmlbody = template(data);
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "naveedmoiz928@gmail.com",
      pass: "xsmtpsib-a038afd3ee78ebab370f6ea01797247f2a314119db637be42a936c8e9b386711-8h2n5HtZa3dRCkOW",
    },
  });

  const message = {
    from: "naveedmoiz928@gmail.com",
    to: email,
    subject: "Order Confirmation",
    html: htmlbody,
  };

  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

// app.post('/setOrderDetailCheck', async (req, res) => {
//   const Email = req.body.Email;
//   const clientFName = req.body.clientFName;
//   const clientLName = req.body.clientLName;
//   const Address = req.body.Address;
//   const Location = req.body.Location;
//   const PhoneNo = req.body.PhoneNo;

//   const templateSource = fs.readFileSync('./Emails/ordermail.handlebars', 'utf8');
//   // console.log(templateSource);
//     const template = handlebars.compile(templateSource);
//     const data = {
//       subject: "I love Coding ",
//       name: "moiz khan"
//   };
//   const htmlbody= template(data);
//   // console.log(htmlbody)
//   // res.status(200).json({message:htmlbody});

//   let transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "naveedmoiz928@gmail.com",
//       pass: "xsmtpsib-a038afd3ee78ebab370f6ea01797247f2a314119db637be42a936c8e9b386711-8h2n5HtZa3dRCkOW",
//     },
//   });

//   // transporter.use('compile',hbs({
//   //   viewEngine:'express-handlebars',
//   //   viewPath:'./Emails/'
//   // }))

//   const message = {
//     from: "naveedmoiz928@gmail.com",
//     to: "naveed4403529@cloud.neduet.edu.pk",
//     subject: "Order Confirmation",
//     html: htmlbody,
//   };

//   transporter.sendMail(message, function (err, info) {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err.message);
//     } else {
//       console.log(info);
//       res.status(200).send('Email sent successfully!');
//     }
//   });
// });


//changing response
app.put('/updateOrderResponse', async (req, res) => {
  const orderId = req.body.id;
  const Response = req.body.status;
  const email = req.body.email;
// console.log("the response would be"+Response+".");
  try {
    console.log(req.body);
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the orderResponse field to true
    order.Response = Response;
    // Save the updated document
    await order.save();
    ApprovalEmail(Response,orderId,email);

    res.status(200).json({ message: 'Order response updated to true' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order response' });
  }
});


app.post('/updateStock', async (req, res) => {
  try {
    const orderItems = req.body;
    console.log(orderItems);

    for (const orderItem of orderItems) {
      const { productId, quantity } = orderItem;

      // Find the product by productId
      const product = await Product.findOne({ productId });

      if (!product) {
        return res.status(404).json({ error: `Product with productId ${productId} not found.` });
      }

      // Update the stock count
      product.stockCount -= quantity;

      // Save the updated product
      await product.save();
    }

    res.status(200).json({ message: 'Stock updated successfully.' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function ApprovalEmail(Response,orderId,email){
  if(Response==='accepted'){
    const templateSource = fs.readFileSync('./Emails/accptanceEmail.handlebars', 'utf8');
    const data = {
      subject: "Order Approved",
      orderid: orderId};
      const template = handlebars.compile(templateSource);
      const htmlbody = template(data);

      let transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: "naveedmoiz928@gmail.com",
          pass: "xsmtpsib-a038afd3ee78ebab370f6ea01797247f2a314119db637be42a936c8e9b386711-8h2n5HtZa3dRCkOW",
        },
      });
    
      const message = {
        from: "naveedmoiz928@gmail.com",
        to: email,
        subject: "Order Approved",
        html: htmlbody
      };
    
      transporter.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

  }else{
    const templateSource = fs.readFileSync('./Emails/rejection.handlebars', 'utf8');
    const data = {
      subject: "Order Rejected",
      orderid: orderId};
      const template = handlebars.compile(templateSource);
      const htmlbody = template(data);
      
      let transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: "naveedmoiz928@gmail.com",
          pass: "xsmtpsib-a038afd3ee78ebab370f6ea01797247f2a314119db637be42a936c8e9b386711-8h2n5HtZa3dRCkOW",
        },
      });
      
      const message = {
        from: "naveedmoiz928@gmail.com",
        to: email,
        subject: "Order Rejection",
        html: htmlbody,
      };
      
      transporter.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
    }

};

const fetchInfoOfProduct = async (productsInfo) =>{
  const productIds = productsInfo.map(item => item.productId);
  const productIdandQunatity = productsInfo;

  try {
    // Query the database to find products by productIds in the Product model
    const products = await Product.find({ productId: { $in: productIds } });
    // console.log(products);
    if (!products || products.length === 0) {
      // If no products are found in the Product model, return a 404 response indicating that the products do not exist
      return 'error';
    }
    // const mergedArray = products.map((objA, index) => ({ ...objA, ...mainObject[index] }));
    // const productsWithQuantity = products.map((product, index) => ({
    //   ...product,
    //   quantity: quantity[index]
    // }));
    // You may need to adapt the logic based on your specific requirements
    // For example, you might want to aggregate data from other models
// console.log(mergedArray)
// console.log(productsWithQuantity)
const productDetailsMap = new Map(products.map(item => [item.productId, item]));

// Merge the arrays based on the product ID
const mergedArray = productIdandQunatity.map(({ productId, quantity }) => ({
  ...productDetailsMap.get(productId),
  quantity
}));
    // Send the product data to the front end
    return (mergedArray);
    // console.log(mergedArray)
  } catch (error) {
    return 'error';
  }
}; 



// this is for checkout and order(admin) as well
app.post("/GetProducts", async (req, res) => {
  console.log(req.body);
  // const mainObject=req.body;
  const productIds = req.body.map(item => item.productId);
  const quantity = req.body.map(item => item.quantity);
  // console.log(productIds);
  // console.log(req.body);
  const productIdandQunatity = req.body;

  try {
    // Query the database to find products by productIds in the Product model
    const products = await Product.find({ productId: { $in: productIds } });
    // console.log(products);
    if (!products || products.length === 0) {
      // If no products are found in the Product model, return a 404 response indicating that the products do not exist
      return res.status(404).send("Products not found");
    }
    // const mergedArray = products.map((objA, index) => ({ ...objA, ...mainObject[index] }));
    // const productsWithQuantity = products.map((product, index) => ({
    //   ...product,
    //   quantity: quantity[index]
    // }));
    // You may need to adapt the logic based on your specific requirements
    // For example, you might want to aggregate data from other models
// console.log(mergedArray)
// console.log(productsWithQuantity)
const productDetailsMap = new Map(products.map(item => [item.productId, item]));

// Merge the arrays based on the product ID
const mergedArray = productIdandQunatity.map(({ productId, quantity }) => ({
  ...productDetailsMap.get(productId),
  quantity
}));
    // Send the product data to the front end
    res.status(200).json(mergedArray);
    // console.log(mergedArray)
  } catch (error) {
    console.error("Error while fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get('/fetchCountryDetails', async (req,res)=>{
  try{
    const data = await DeliveryPricing.find({});
    res.status(200).json(data)
  }catch{
    console.status(500).json("error")
  }
  
})


app.listen(3334, () => {
  console.log("The Server is running on port 3334");
});
