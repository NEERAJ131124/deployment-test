const express = require('express');
const {
  createColdStorageGood,
  getAllColdStorageGoods,
  getColdStorageGoodById,
  updateColdStorageGoodById,
  deleteColdStorageGoodById,
} = require('../controllers/GoodsType');

const router = express.Router();


// CRUD routes for Cold Storage Goods

/**
 * @swagger
 * /goodstypes:
 *   post:
 *     summary: Create a new cold storage good
 *     tags: [ColdStorageGoods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Category:
 *                 type: string
 *                 example: 'Food and Beverages'
 *               SubCategory:
 *                 type: string
 *                 example: 'Fresh Produce'
 *               Name:
 *                 type: string
 *                 example: 'Apples'
 *               Description:
 *                 type: string
 *                 example: 'Fresh apples stored to maintain crispness and flavor.'
 *               TemperatureRequirement:
 *                 type: string
 *                 example: '2-4°C'
 *     responses:
 *       201:
 *         description: Cold storage good created successfully
 *       500:
 *         description: Error creating cold storage good
 */
router.post('/', createColdStorageGood);

/**
 * @swagger
 * /goodstypes:
 *   get:
 *     summary: Get all cold storage goods
 *     tags: [ColdStorageGoods]
 *     responses:
 *       200:
 *         description: Cold storage goods fetched successfully
 *       500:
 *         description: Error fetching cold storage goods
 */
router.get('/', getAllColdStorageGoods);

/**
 * @swagger
 * /goodstypes/{id}:
 *   get:
 *     summary: Get a cold storage good by ID
 *     tags: [ColdStorageGoods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cold storage good to get
 *     responses:
 *       200:
 *         description: Cold storage good fetched successfully
 *       404:
 *         description: Cold storage good not found
 *       500:
 *         description: Error fetching cold storage good
 */
router.get('/:id', getColdStorageGoodById);

/**
 * @swagger
 * /goodstypes/{id}:
 *   put:
 *     summary: Update a cold storage good by ID
 *     tags: [ColdStorageGoods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cold storage good to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Category:
 *                 type: string
 *                 example: 'Food and Beverages'
 *               SubCategory:
 *                 type: string
 *                 example: 'Fresh Produce'
 *               Name:
 *                 type: string
 *                 example: 'Apples'
 *               Description:
 *                 type: string
 *                 example: 'Fresh apples stored to maintain crispness and flavor.'
 *               TemperatureRequirement:
 *                 type: string
 *                 example: '2-4°C'
 *     responses:
 *       200:
 *         description: Cold storage good updated successfully
 *       404:
 *         description: Cold storage good not found
 *       500:
 *         description: Error updating cold storage good
 */
router.put('/:id', updateColdStorageGoodById);

/**
 * @swagger
 * /goodstypes/{id}:
 *   delete:
 *     summary: Delete a cold storage good by ID
 *     tags: [ColdStorageGoods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cold storage good to delete
 *     responses:
 *       200:
 *         description: Cold storage good deleted successfully
 *       404:
 *         description: Cold storage good not found
 *       500:
 *         description: Error deleting cold storage good
 */
router.delete('/:id', deleteColdStorageGoodById);

module.exports = router;
