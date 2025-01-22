const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");
const dotenv = require("dotenv");

/**
 * @swagger
 * /location:
 *   get:
 *     summary: Get location based on latitude and longitude
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: string
 *         required: true
 *         description: Latitude of the location
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: string
 *         required: true
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: Location fetched successfully
 *       400:
 *         description: Latitude and Longitude are required
 *       500:
 *         description: Error fetching location data
 */
router.get("/", async (req, res) => {
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
        res.status(500).json({ error: "Error fetching location data", error: error.response });
    }
});

module.exports = router;
