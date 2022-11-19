const asyncHandler = require('express-async-handler');

/*
@desc Get the data from the geocoding API
@route /api/geocoding
@access Public
*/
const getGeocoding = asyncHandler(async(req, res) =>
{
  
  // Hold the location from the request body
  const {location} = req.body;
  
  // Attempt the API call
  try
  {

    // Hold the response from the call
    const response =  await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GEOCODING_API_KEY}`)
    
    // Hold the data as a JSON object
    const data = await response.json();
    
    // Send the data
    res.status(200).json(data)
  }

  // Catch an error
  catch(error)
  {
    res.status(401)
  }
})

module.exports =
{
  getGeocoding
}