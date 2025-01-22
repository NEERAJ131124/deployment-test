const express = require('express');
const router = express.Router();
const storageCapacityController = require('../controllers/StorageCapacity');
const { auth } = require('../middlewares/Auth');

/**
 * @swagger
 * /capacities:
 *   get:
 *     summary: Get all storage capacities
 *     tags: [Capacities]
 *     responses:
 *       200:
 *         description: The list of all storage capacities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StorageCapacity'
 */
router.get('/', storageCapacityController.getAllCapacities);

/**
 * @swagger
 * /capacities/{id}:
 *   get:
 *     summary: Get a storage capacity by ID
 *     tags: [Capacities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The storage capacity ID
 *     responses:
 *       200:
 *         description: The storage capacity description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorageCapacity'
 *       404:
 *         description: Storage capacity not found
 */
router.get('/:id', storageCapacityController.getCapacityById);

/**
 * @swagger
 * /capacities:
 *   post:
 *     summary: Create a new storage capacity
 *     tags: [Capacities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StorageCapacity'
 *     responses:
 *       201:
 *         description: The storage capacity was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorageCapacity'
 */
router.post('/', storageCapacityController.createCapacity);

/**
 * @swagger
 * /capacities/{id}:
 *   put:
 *     summary: Update a storage capacity by ID
 *     tags: [Capacities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The storage capacity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StorageCapacity'
 *     responses:
 *       200:
 *         description: The storage capacity was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorageCapacity'
 *       404:
 *         description: Storage capacity not found
 */
router.put('/:id',auth, storageCapacityController.updateCapacity);

/**
 * @swagger
 * /capacities/{id}:
 *   delete:
 *     summary: Delete a storage capacity by ID
 *     tags: [Capacities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The storage capacity ID
 *     responses:
 *       200:
 *         description: The storage capacity was successfully deleted
 *       404:
 *         description: Storage capacity not found
 */
router.delete('/:id', storageCapacityController.deleteCapacity);

module.exports = router;
