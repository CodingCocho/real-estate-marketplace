import axios from 'axios';

// Hold the URL to the api call
const API_URL: string ='/api/geocoding/'

/*
Make a post request to the server to retrieve the geocoding data.
@param locationData the location of the property
@return JSON the data of the geocoding API
*/
const getgeocodingResult = async(locationData: string) =>
{

  // Send the data as an object
  let data = {location: locationData}

  // Make the post request with the data in the request body
  const response = await axios.post(API_URL, data)

  // Return the JSON data
  return response.data;
}

const geocodingService =
{
  getgeocodingResult
}

export default geocodingService;