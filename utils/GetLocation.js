const { default: axios } = require("axios");
const dotenv = require("dotenv");

// Function to get the location based on latitude and longitude using Azure Maps API
const getLocation = async (req, res) => {
    const { latitude, longitude } = req.query;
    dotenv.config();
    const azureMapsKey = process.env.azureMapsKey;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }
  
    const url = `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&query=${latitude},${longitude}&subscription-key=${azureMapsKey}`;

    try {
      // Make the request to the Azure Maps API
      const response = await axios.get(url);

  
      const { data } = response;
      // const locationData = {
      //   state: data.addresses[0]?.address?.adminDistrict,
      //   country: data.addresses[0]?.address?.country,
      // };

      // return proper response with code and data, message
      res.status(200).json({ success: true, data: data, message: "Location fetched successfully" });
    } catch (error) {
        console.error("Error from Azure Maps API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error fetching location data",error:error.response });
    }
}

module.exports = getLocation;
