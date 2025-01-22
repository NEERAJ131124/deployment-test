const StorageTransaction = require("../models/StorageTransaction");
const StorageFacilityModel = require("../models/StorageFacility");
const axios = require("axios");
const sha256 = require("sha256");
const { generateOrderId } = require("../utils/GenerateOrderId");
const StorageFacility = require("../models/StorageFacility");
const Coupon = require("../models/Coupon");
const Payment = require("../models/Payment");
require("dotenv").config();

const PHONEPE_URL = process.env.PHONEPE_URL;
const BASE_URL = process.env.BASE_URL;
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY;
/**
 * The API key used for the PhonePe payment gateway integration.
 */

const PHONEPE_KEY_INDEX = process.env.PHONEPE_KEY_INDEX;

// Create a new Storage Transaction
exports.createStorageTransaction = async (req, res) => {
  try {
    const {
      TransactionNumber,
      TransactionAmount,
      TransactionTime,
      StorageFacility,
      user,
      Coupen,
    } = req.body;

    // Validate required fields
    if (
      !TransactionNumber ||
      !TransactionAmount ||
      !TransactionTime ||
      !StorageFacility ||
      !user
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if transaction number is unique
    const existingTransaction = await StorageTransaction.findOne({
      TransactionNumber,
    });
    if (existingTransaction) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction number already exists" });
    }

    // Create a new transaction
    const newTransaction = new StorageTransaction({
      TransactionNumber,
      TransactionAmount,
      TransactionTime,
      StorageFacility,
      User: user,
    });

    await newTransaction.save();

    // Update the Storage Facility's IsActive to true
    await StorageFacilityModel.findByIdAndUpdate(StorageFacility, {
      IsActive: true,
    });

    res.status(201).json({
      success: true,
      data: newTransaction,
      message: "Storage transaction created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating storage transaction",
      error: error.message,
    });
  }
};

// Get all storage transactions
exports.getAllStorageTransactions = async (req, res) => {
  try {
    const transactions = await StorageTransaction.find().populate([
      "StorageFacility",
      "User",
      "Coupen",
    ]);

    res.status(200).json({
      message: "Storage transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single storage transaction by ID
exports.getStorageTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await StorageTransaction.findById(id).populate([
      "StorageFacility",
      "User",
      "Coupen",
    ]);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a storage transaction
exports.updateStorageTransaction = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTransaction = await StorageTransaction.findByIdAndUpdate(
      id,
      { ...updateData, UpdatedOn: Date.now() },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a storage transaction (soft delete)
exports.deleteStorageTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await StorageTransaction.findByIdAndUpdate(
      id,
      { IsDeleted: true, IsActive: false },
      { new: true }
    );

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.initiatePayment = async (req, res) => {
  const { Id, CouponName, Amount } = req.body;
  try {
    const orderId = await generateOrderId();
    let couponDetails = null;
    const amount = await Payment.findOne({ Type: "Storage Facility" });
    if (CouponName) {
      couponDetails = await Coupon.findOne({ CoupenName: CouponName });
      if (!couponDetails) {
        return res.status(400).json({ message: "Coupon is invalid" });
      }
    }
    const transactionData = {
      TransactionNumber: orderId,
      TransactionAmount: amount.Amount,
      TransactionTime: new Date(),
      StorageFacility: Id,
      IsSuccess: false,
      CreatedOn: new Date(),
    };
    if (couponDetails) {
      transactionData.Coupon = couponDetails._id;
    }
    const transaction = new StorageTransaction(transactionData);
    await transaction.save();

    // Prepare the payload for the payment request
    const paymentPayload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: Id,
      amount: amount.Amount * 100 || 100, // Convert to paisa
      redirectUrl: `https://lively-tree-0ac894a00.4.azurestaticapps.net/validatepayment/${orderId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.BACKEND_URI}/payment/callback`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const bufferObj = Buffer.from(JSON.stringify(paymentPayload), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");

    const xVerifyChecksum =
      sha256(base64EncodedPayload + "/pg/v1/pay" + PHONEPE_API_KEY) +
      "###" +
      PHONEPE_KEY_INDEX;

    const response = await axios.post(
      PHONEPE_URL,
      { request: base64EncodedPayload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    );

    console.log("PhonePe response:", response.data);

    res.json({
      success: true,
      data: {
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
      },
      phonePeResponse: response.data,
    });
  } catch (error) {
    console.error(
      "Payment initiation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Payment initiation failed.",
      details: error.response?.data || error.message,
    });
  }
};

exports.paymentCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    console.log("Payment Callback Received:", callbackData);

    const receivedSignature = req.headers["x-verify"];
    const dataToHash = JSON.stringify(callbackData) + PHONEPE_API_KEY;
    const expectedSignature = sha256(dataToHash);

    if (receivedSignature !== expectedSignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid callback signature" });
    }

    const { code, data } = callbackData;
    const transaction = await StorageTransaction.findOne({
      TransactionNumber: data.merchantTransactionId,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    transaction.IsSuccess = code === "PAYMENT_SUCCESS";
    transaction.UpdatedOn = new Date();
    await transaction.save();

    res.status(200).send("Callback received successfully");
  } catch (error) {
    console.error("Callback processing failed:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.validatePayment = async (req, res) => {
  const { merchantTransactionId } = req.params;

  if (merchantTransactionId) {
    try {
      const statusUrl = `${BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;
      const stringToHash = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}${PHONEPE_API_KEY}`;
      const sha256_val = sha256(stringToHash);
      const xVerifyChecksum = sha256_val + "###" + 1;

      const response = await axios.get(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
          accept: "application/json",
        },
      });

      if (response.data && response.data.code === "PAYMENT_SUCCESS") {
        const transaction = await StorageTransaction.findOne({
          TransactionNumber: merchantTransactionId,
        });
        if (transaction) {
          transaction.IsSuccess = true;
          transaction.UpdatedOn = new Date();
          await transaction.save();

          // Fetch storage facility details
          const storageFacility = await StorageFacility.findById(
            transaction.StorageFacility
          );

          if (storageFacility) {
            storageFacility.IsPaid = true;
            storageFacility.IsActive = true;
            await storageFacility.save();
            console.log(storageFacility);
            response.data.data.transactionId = merchantTransactionId;
            response.data.data.orderId = transaction._id;
            response.data.data.storageFacility = {
              id: storageFacility._id,
              name: storageFacility.Name,
            };
            // Send detailed response
            res.status(200).json({ ...response.data });
          } else {
            res.status(500).json({
              success: false,
              error: "Storage facility not found.",
            });
          }
        } else {
          res.status(404).json({
            success: false,
            error: "Transaction not found.",
          });
        }
      } else {
        res.json(response.data);
      }
    } catch (error) {
      console.error(
        "Payment validation error:",
        error.response?.data || error.message
      );
      res.status(500).json({
        success: false,
        error: "Payment validation failed.",
        details: error.response?.data || error.message,
      });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
};
