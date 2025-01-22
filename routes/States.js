const express = require("express");
const router = express.Router();
const {
  createState,
  getAllStates,
  getStateById,
  updateState,
  deleteState,
  getStatesByCountryId
} = require("../controllers/States");

// Create a new state
/**
 * @swagger
 * /states:
 *   post:
 *     summary: Create a new state
 *     tags: [States]
 *     description: Allows creation of a new state in a specific country.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               StateName:
 *                 type: string
 *                 description: Name of the state.
 *               CountryID:
 *                 type: string
 *                 description: The country ID for the state.
 *     responses:
 *       201:
 *         description: State created successfully.
 *       400:
 *         description: Missing required fields or state already exists.
 *       404:
 *         description: Country not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createState);

// Get all states
/**
 * @swagger
 * /states:
 *   get:
 *     summary: Get all states
 *     tags: [States]
 *     description: Retrieves all states that are not marked as deleted.
 *     responses:
 *       200:
 *         description: States fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       StateName:
 *                         type: string
 *                       CountryID:
 *                         type: string
 *                       IsDeleted:
 *                         type: boolean
 *       500:
 *         description: Internal server error.
 */
router.get("/", getAllStates);

// Get states by country ID
/**
 * @swagger
 * /states/states-by-country/{id}:
 *   get:
 *     summary: Get all states by CountryID
 *     tags: [States]
 *     description: Retrieve all states that belong to a specific country.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the country to get the states for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: States fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       StateName:
 *                         type: string
 *                       CountryID:
 *                         type: string
 *                       IsDeleted:
 *                         type: boolean
 *       400:
 *         description: Country ID is required.
 *       404:
 *         description: Country not found or No states found for the given country.
 *       500:
 *         description: Internal server error.
 */
router.get("/states-by-country/:id", getStatesByCountryId);

// Get state by ID
/**
 * @swagger
 * /states/{id}:
 *   get:
 *     summary: Get state by ID
 *     tags: [States]
 *     description: Retrieves a specific state by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the state.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: State fetched successfully.
 *       400:
 *         description: State ID is required.
 *       404:
 *         description: State not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getStateById);

// Update a state
/**
 * @swagger
 * /states/{id}:
 *   put:
 *     summary: Update state details
 *     tags: [States]
 *     description: Allows updating the state information like name and country.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the state.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               StateName:
 *                 type: string
 *                 description: Updated name of the state.
 *               CountryID:
 *                 type: string
 *                 description: The country ID for the state.
 *               IsActive:
 *                 type: boolean
 *                 description: Whether the state is active.
 *     responses:
 *       200:
 *         description: State updated successfully.
 *       400:
 *         description: Missing required fields or invalid state ID.
 *       404:
 *         description: State not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateState);

// Soft delete a state
/**
 * @swagger
 * /states/{id}:
 *   delete:
 *     summary: Soft delete a state
 *     tags: [States]
 *     description: Marks a state as deleted without removing it from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the state to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: State deleted successfully.
 *       400:
 *         description: State ID is required.
 *       404:
 *         description: State not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteState);

module.exports = router;
