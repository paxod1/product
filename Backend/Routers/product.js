const verifyToken = require('../TokenVerification');
const router = require('express').Router();
const Product = require('../models/Products');
require('dotenv').config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
console.log("Twilio Client Type:", typeof client);
console.log("Twilio Config:", process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_PHONE);



router.post("/AddNewProduct", verifyToken, async (req, res) => {
    try {
        const { productname, productnum, productEx, userid } = req.body;

        if (!productname || !productnum || !productEx) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the product with the same product number already exists for the same user
        const existingProduct = await Product.findOne({ productnum, userid });

        if (existingProduct) {
            return res.status(400).json({ message: "Product number already exists for this user." });
        }

        // Create and save the new product
        const newProduct = new Product({
            productname,
            productnum,
            productEx,
            userid: userid
        });

        await newProduct.save();
        res.status(201).json({ message: "Product saved successfully", product: newProduct });
    } catch (err) {
        console.error("Error saving product:", err);
        res.status(500).json({ message: "Failed to save product", error: err.message });
    }
});


router.post("/AllProduct/:id", verifyToken, async (req, res) => {
    const userid = req.params.id
    try {
        const productdata = await Product.find({userid:userid})
        res.status(200).json(productdata)
    } catch (err) {
        console.error("Error saving product:", err);
        res.status(500).json({ message: "Failed to save product", error: err.message });
    }
});




// automatic sending message seciton ********************************************************************
const adminPhoneNumbers = ["+919961964928"];

// Connect to MongoDB
mongoose.connect(process.env.mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log("Scheduled task initialized...");

// minute and hour
cron.schedule("26 21 * * *", async () => {
    try {

        const today = new Date().toISOString().split("T")[0];
        const products = await Product.find({
            $or: [{ productEx: today }],
        });

        if (products.length > 0) {
            const productNames = products.map((p) => p.productname).join(", ");

            // Send SMS to all numbers using Twilio
            for (const number of adminPhoneNumbers) {
                console.log(" Sending SMS to:", number);
                const message = await client.messages.create({
                    body: messageBody,
                    from: process.env.TWILIO_PHONE,
                    to: number,
                });

                console.log(`SMS Sent Successfully to ${number}:`, message.sid);
            }
        } else {
            console.log("No expiring products today.");
        }
    } catch (error) {
        console.error(" Error in scheduled task:", error.message);
    }
});



// Get single product details by ID
router.get('/getproduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Update product by ID
router.put('/update/:id', async (req, res) => {
    try {
        const { productname, productnum, productEx} = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { productname, productnum, productEx},
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});



// Delete product by ID
router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






module.exports = router;

