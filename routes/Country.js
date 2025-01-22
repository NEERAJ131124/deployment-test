const express = require("express");
const router = express.Router();
const {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
} = require("../controllers/Country");

/**
 * @swagger
 * /country:
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CountryName:
 *                 type: string
 *                 example: "India"
 *               ISOCode:
 *                 type: string
 *                 example: "IN"
 *     responses:
 *       201:
 *         description: Country created successfully
 *       400:
 *         description: All required fields must be provided or Country already exists
 *       500:
 *         description: Error creating country
 */
router.post("/", createCountry);

/**
 * @swagger
 * /country:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Countries fetched successfully
 *       500:
 *         description: Error fetching countries
 */
router.get("/", getAllCountries);

/**
 * @swagger
 * /country/{id}:
 *   get:
 *     summary: Get a country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Country ID
 *     responses:
 *       200:
 *         description: Country fetched successfully
 *       400:
 *         description: Country ID is required
 *       404:
 *         description: Country not found
 *       500:
 *         description: Error fetching country
 */
router.get("/:id", getCountryById);

/**
 * @swagger
 * /country/{id}:
 *   put:
 *     summary: Update a country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Country ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CountryName:
 *                 type: string
 *                 example: "India"
 *               ISOCode:
 *                 type: string
 *                 example: "IN"
 *               IsActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Country updated successfully
 *       400:
 *         description: Country ID is required or All required fields must be provided
 *       404:
 *         description: Country not found
 *       500:
 *         description: Error updating country
 */
router.put("/:id", updateCountry);

/**
 * @swagger
 * /country/{id}:
 *   delete:
 *     summary: Soft delete a country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Country ID
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *       400:
 *         description: Country ID is required
 *       404:
 *         description: Country not found
 *       500:
 *         description: Error deleting country
 */
router.delete("/:id", deleteCountry);

module.exports = router;
