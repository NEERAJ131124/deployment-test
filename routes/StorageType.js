const express = require("express");
const { createStorageType, getAllStorageTypes, getStorageTypeById, updateStorageType, deleteStorageType } = require("../controllers/StorageType");
const router = express.Router();

/**
 * @swagger
 * /storagetype:
 *   post:
 *     summary: Create a new storage type along with storage capacity
 *     tags: [Storage Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Type:
 *                 type: string
 *                 example: "SSD"
 *     responses:
 *       201:
 *         description: Storage Type created successfully with related Storage Capacity
 *       500:
 *         description: Server Error
 */
router.post("/", createStorageType);

/**
 * @swagger
 * /storagetype:
 *   get:
 *     summary: Get all storage types along with storage capacity details
 *     tags: [Storage Types]
 *     responses:
 *       200:
 *         description: Storage Types fetched successfully
 *       500:
 *         description: Server Error
 */
router.get("/", getAllStorageTypes);

/**
 * @swagger
 * /storagetype/{id}:
 *   get:
 *     summary: Get a specific storage type with its storage capacity
 *     tags: [Storage Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Storage Type ID
 *     responses:
 *       200:
 *         description: Storage Type fetched successfully
 *       404:
 *         description: Storage Type not found
 *       500:
 *         description: Server Error
 */
router.get("/:id", getStorageTypeById);

/**
 * @swagger
 * /storagetype/{id}:
 *   put:
 *     summary: Update a specific storage type and its associated storage capacity
 *     tags: [Storage Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Storage Type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Type:
 *                 type: string
 *                 example: "SSD"
 *     responses:
 *       200:
 *         description: Storage Type and related Storage Capacity updated successfully
 *       404:
 *         description: Storage Type not found
 *       500:
 *         description: Server Error
 */
router.put("/:id", updateStorageType);

/**
 * @swagger
 * /storagetype/{id}:
 *   delete:
 *     summary: Delete a specific storage type and its related storage capacity
 *     tags: [Storage Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Storage Type ID
 *     responses:
 *       200:
 *         description: Storage Type and related Storage Capacity deleted successfully
 *       404:
 *         description: Storage Type not found
 *       500:
 *         description: Server Error
 */
router.delete("/:id", deleteStorageType);

module.exports = router;
