const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

// Hold the Express.js application
const app = express();

// Hold body parser middleware to send raw JSON
app.use(express.json())

// Hold middleware to accept url encoded form
app.use(express.urlencoded({extended: false}))

// Enable cors
app.use(cors());

app.use('/api/geocoding', require('./routes/geocodingRoute'));

app.get('/', (req, res) => 
{
    res.status(200).json({message: 'Welcome to Cocho Real Estate'})
})


// Run Express.js server on port 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));