const verifyToken = require('../TokenVerification');
const router = require('express').Router();
const Product = require('../models/Products');
require('dotenv').config();



router.post("/AddNewProduct", verifyToken, async (req, res) => {
    try {
        const { productname, productnum, productEx, userid } = req.body;

        if (!productname || !productnum || !productEx) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingProduct = await Product.findOne({ productnum, userid });

        if (existingProduct) {
            return res.status(400).json({ message: "Product number already exists for this user." });
        }
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

