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

// Use the route for the geocoding API
app.use('/api/geocoding', require('./routes/geocodingRoute'));

// Serve the client 
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname, '../client/build')))

    app.get('*', (req, res) => 
    {
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })

    app.get('/', (req, res) => 
    {
        res.status(200).json({message: 'Welcome to my Real Estate MarketPlace'})
    })
}

// Run Express.js server on port 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));