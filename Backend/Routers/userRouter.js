const router = require('express').Router();
const user = require('../models/userSechema');
const crypto = require('crypto-js')
const JWT = require('jsonwebtoken');
const verifyToken = require('../TokenVerification')

router.post('/signup', async (req, res) => {
    console.log('Received data:', req.body);
    req.body.password = crypto.AES.encrypt(req.body.password, process.env.passkey).toString()
    try {
        const newUser = new user({
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        });
        await newUser.save();
        res.status(200).json('Signup successfully');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user', error });
    }
});
router.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const FindUser = await user.findOne({ email: req.body.email });
        if (!FindUser) return res.status(401).json('Invalid email or password');
        const bytes = crypto.AES.decrypt(FindUser.password, process.env.passkey);
        const originalPassword = bytes.toString(crypto.enc.Utf8);
        if (req.body.password !== originalPassword) return res.status(401).json('Invalid email or password');
        const Token = JWT.sign({ id: FindUser._id }, process.env.seckey, { expiresIn: '100d' });
        console.log("Token:", Token);
        res.status(200).json({ Token, id: FindUser._id });

    } catch (err) {
        console.error("Error during user login:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


router.post('/check', verifyToken, (req, res) => {
    res.status(200).json('Token is valid');
  });

module.exports = router;


