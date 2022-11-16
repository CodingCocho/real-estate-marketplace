const asyncHandler = require('express-async-handler');

const getGeocoding = asyncHandler(async(req, res) =>
{
  const {location} = req.body;
  try
  {
    const response =  await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GEOCODING_API_KEY}`)
    const data = await response.json();
    res.status(200).json(data)
  }
  catch(error)
  {
    res.status(401)
  }
})

module.exports =
{
  getGeocoding
}