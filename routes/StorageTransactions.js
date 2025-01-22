const express = require("express");
const router = express.Router();
const storageTransactionController = require("../controllers/StorageTransactions");
const { auth } = require("../middlewares/Auth");


/**
 * @swagger
 * /storageTransactions:
 *   post:
 *     summary: Create a new storage transaction
 *     tags: [StorageTransaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TransactionNumber:
 *                 type: string
 *                 description: Unique transaction number.
 *               TransactionAmount:
 *                 type: number
 *                 description: Amount of the transaction.
 *               TransactionTime:
 *                 type: string
 *                 format: date-time
 *                 description: Time of the transaction.
 *               StorageFacility:
 *                 type: string
 *                 description: ID of the storage facility.
 *               User:
 *                 type: string
 *                 description: ID of the user.
 *             required:
 *               - TransactionNumber
 *               - TransactionAmount
 *               - TransactionTime
 *               - StorageFacility
 *               - User
 *     responses:
 *       201:
 *         description: Storage transaction created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

router.post("/",auth, storageTransactionController.createStorageTransaction);

/**
 * @swagger
 * /storageTransactions:
 *   get:
 *     summary: Retrieve all storage transactions
 *     tags: [StorageTransaction]
 *     responses:
 *       200:
 *         description: A list of storage transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StorageTransaction'
 *       500:
 *         description: Internal server error.
 */
router.get("/", storageTransactionController.getAllStorageTransactions);

/**
 * @swagger
 * /storageTransactions/{id}:
 *   get:
 *     summary: Retrieve a storage transaction by ID
 *     tags: [StorageTransaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The storage transaction ID.
 *     responses:
 *       200:
 *         description: Storage transaction data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorageTransaction'
 *       404:
 *         description: Storage transaction not found.
 *       500:
 *         description: Internal server error.
 */

router.get("/:id", storageTransactionController.getStorageTransactionById);

/**
 * @swagger
 * /storageTransactions/{id}:
 *   put:
 *     summary: Update a storage transaction by ID
 *     tags: [StorageTransaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The storage transaction ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TransactionNumber:
 *                 type: string
 *                 description: Updated transaction number.
 *               TransactionAmount:
 *                 type: number
 *                 description: Updated transaction amount.
 *               TransactionTime:
 *                 type: string
 *                 format: date-time
 *                 description: Updated transaction time.
 *               StorageFacility:
 *                 type: string
 *                 description: Updated storage facility ID.
 *               User:
 *                 type: string
 *                 description: Updated user ID.
 *               Coupen:
 *                 type: string
 *                 description: Updated coupen ID.
 *               IsActive:
 *                 type: boolean
 *                 description: Indicates if the transaction is active.
 *               IsDeleted:
 *                 type: boolean
 *                 description: Indicates if the transaction is deleted.
 *     responses:
 *       200:
 *         description: Storage transaction updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Storage transaction not found.
 *       500:
 *         description: Internal server error.
 */

router.put("/:id", storageTransactionController.updateStorageTransaction);
/**
 * @swagger
 * /storageTransactions/{id}:
 *   delete:
 *     summary: Delete a storage transaction by ID
 *     tags: [StorageTransaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The storage transaction ID.
 *     responses:
 *       200:
 *         description: Storage transaction marked as deleted.
 *       404:
 *         description: Storage transaction not found.
 *       500:
 *         description: Internal server error.
 */

router.delete("/:id", storageTransactionController.deleteStorageTransaction);

module.exports = router;
