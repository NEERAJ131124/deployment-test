const express = require("express");
const { validatePayment, paymentCallback, initiatePayment } = require("../controllers/StorageTransactions");
require("dotenv").config();

const router = express.Router();

// Initiate Payment
/**
 * @swagger
 * /payment/facilitystorage:
 *   post:
 *     summary: Initiate Payment
 *     description: Initiates a payment request for a storage facility using PhonePe.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: string
 *                 description: Unique identifier for the storage facility.
 *                 example: "676a44859269930004609571"
 *               CouponName:
 *                 type: string
 *                 description: Name of the coupon for discount (if applicable).
 *                 example: "DISCOUNT20"
 *               Amount:
 *                 type: number
 *                 description: Original amount of the transaction.
 *                 example: 1500
 *     responses:
 *       200:
 *         description: Payment URL generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentUrl:
 *                       type: string
 *                       description: Redirect URL for completing the payment.
 *                       example: "https://phonepe/payment?transactionId=12345"
 *                 phonePeResponse:
 *                   type: object
 *                   description: Raw response from PhonePe.
 *       500:
 *         description: Payment initiation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Payment initiation failed."
 */
router.post("/facilitystorage", initiatePayment);

// Callback Route
// /**
//  * @swagger
//  * /payment/callback:
//  *   post:
//  *     summary: Payment Callback
//  *     description: Handles the payment callback from PhonePe.
//  *     tags:
//  *       - Payments
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             additionalProperties: true
//  *     responses:
//  *       200:
//  *         description: Callback received successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Callback received successfully."
//  *       400:
//  *         description: Invalid callback signature.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Invalid callback signature."
//  *       500:
//  *         description: Callback processing failed.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Internal server error."
//  */

router.post("/callback", paymentCallback);

// Validate Payment Status
/**
 * @swagger
 * /payment/validate/{merchantTransactionId}:
 *   get:
 *     summary: Validate Payment Status
 *     description: Validates the status of a payment using the merchant transaction ID.
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: merchantTransactionId
 *         in: path
 *         required: true
 *         description: Unique identifier for the merchant transaction.
 *         schema:
 *           type: string
 *           example: "ORDER_12345"
 *     responses:
 *       200:
 *         description: Payment status validated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Payment status details.
 *       400:
 *         description: Invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request."
 */
router.get("/validate/:merchantTransactionId", validatePayment);


module.exports = router;
