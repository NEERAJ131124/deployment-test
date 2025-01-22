const express = require("express");
const router = express.Router();
const couponController = require("../controllers/Coupon");

/**
 * @swagger
 * /coupon:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CoupenName:
 *                 type: string
 *                 example: "SUMMER2024"
 *               DiscountPercentage:
 *                 type: number
 *                 example: 20
 *               EndsOn:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */
router.post("/", couponController.createCoupon);

// /**
//  * @swagger
//  * /coupon/verify:
//  *   post:
//  *     summary: Verify a coupon
//  *     tags: [Coupons]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               CoupenName:
//  *                 type: string
//  *                 example: "SUMMER2024"
//  *     responses:
//  *       200:
//  *         description: Coupon is valid
//  *       400:
//  *         description: Coupon name is required or Coupon is expired
//  *       404:
//  *         description: Invalid coupon. Coupon not found
//  *       500:
//  *         description: Internal Server Error
//  */

router.post("/verify", couponController.verifyCoupon);

/**
 * @swagger
 * /coupon:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: Coupons retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", couponController.getCoupons);

/**
 * @swagger
 * /coupon/{id}:
 *   get:
 *     summary: Get a single coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon retrieved successfully
 *       400:
 *         description: Coupon ID is required
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", couponController.getCouponById);

/**
 * @swagger
 * /coupon/validateCoupon/{coupon}:
 *   get:
 *     summary: Validate a coupon by its code
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: coupon
 *         required: true
 *         description: The coupon code to validate
 *         schema:
 *           type: string
 *           example: FESTIVE50
 *     responses:
 *       200:
 *         description: Coupon is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupon is valid"
 *                 data:
 *                   type: object
 *                   properties:
 *                     finalAmount:
 *                       type: number
 *                       example: 850
 *       400:
 *         description: Coupon is expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupon is expired."
 *       404:
 *         description: Invalid coupon. Coupon not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid coupon. Coupon not found."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get("/validateCoupon/:coupon", couponController.validateCoupon);

/**
 * @swagger
 * /coupon/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CoupenName:
 *                 type: string
 *                 example: "SUMMER2024"
 *               DiscountPercentage:
 *                 type: number
 *                 example: 25
 *               EndsOn:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Coupon ID is required or All fields are required
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", couponController.updateCoupon);

/**
 * @swagger
 * /coupon/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       400:
 *         description: Coupon ID is required
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
