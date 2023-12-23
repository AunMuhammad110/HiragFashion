const mongoose = require('mongoose');

const ProductInfoSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const OrderSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    clientFName:{
        type:String,
        required:true
    },
    clientLName:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    postalCode:{
        type:Number,

    },
    PhoneNo:{
        type:Number,
        required:true
    },
    Image:{
        type:String
    },
    NoProduct:{
        type:Number,
    },
    totalBill:{
        type:Number,
        required:true
    },
    Location:{
        type:String,
        Required:true
    },
    Response:{
        type:String,
        default:"Pending"
    },
    productsInfo: [ProductInfoSchema]

});
const Order = mongoose.model('Order',OrderSchema,'orderCollection')
module.exports=Order;