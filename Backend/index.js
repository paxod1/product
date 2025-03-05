const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./Routers/userRouter');
const productRouter = require('./Routers/product')

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.mongodbURL)
    .then(() => console.log('Database is connected'))
    .catch((error) => console.error('Database connection error:', error));

// Routes
app.use('/user', userRouter);
app.use('/product', productRouter)

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
