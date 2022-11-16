import axios from 'axios';

const API_URL: string ='/api/geocoding/'

const getgeocodingResult = async(locationData: string) =>
{
  // Hold the response of the get request
  let data = {location: locationData}
  const response = await axios.post(API_URL, data)
  return response.data;
}

const geocodingService =
{
  getgeocodingResult
}

export default geocodingService;