const Coupon = require("../models/Coupon");
const GstDetail = require("../models/GST");
const mongoose = require("mongoose");

exports.createDummyGstDetails = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { storageFacilityId, type } = req.body;

    // Validate input
    if (!storageFacilityId || !type) {
      return res.status(400).json({
        success: false,
        message: "Storage facility ID and type are required.",
      });
    }

    // Generate dummy details
    const dummyAmount = 1000 // Random amount between 500 and 10500
    const dummyGstRate = 18; // Example GST rate
    const gstAmount = (dummyAmount * dummyGstRate) / 100;
    const taxableValue = dummyAmount - gstAmount;

    const dummyGstDetail = {
      type: type,
      amount: dummyAmount,
      gst: dummyGstRate,
      gstAmount: gstAmount,
      taxableValue: taxableValue,
      hsnOrSacCode: "9999", // Dummy HSN/SAC Code
      gstType: "CGST", // Example GST type
      transactionDate: new Date(),
      invoiceNumber: `INV-${Date.now()}`, // Dummy Invoice Number
      partyName: `Storage Facility ${storageFacilityId}`, // Dummy Party Name
      gstin: "27ABCDE1234F2Z5", // Dummy GSTIN
      isReverseCharge: false,
      createdBy: "System",
      remarks: "Dummy GST details generated for testing.",
    };

    // Save to the database
    const gstDetail = new GstDetail(dummyGstDetail);
    await gstDetail.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "GST details created successfully.",
      data: gstDetail,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating GST details:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating GST details.",
      error: error.message,
    });
  }
};

exports.applyCouponToGstDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { gstDetailId, couponCode } = req.body;
  
      // Validate input
      if (!gstDetailId || !couponCode) {
        return res.status(400).json({
          success: false,
          message: "GST Detail ID and coupon code are required.",
        });
      }
  
      // Find the GST detail
      const gstDetail = await GstDetail.findById(gstDetailId).session(session);
      if (!gstDetail) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "GST detail not found.",
        });
      }
  
      // Find the coupon by code
      const coupon = await Coupon.findOne({ code: couponCode }).session(session);
      if (!coupon) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Coupon not found.",
        });
      }
  
      if (!coupon.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Coupon is inactive or expired.",
        });
      }
  
      // Calculate discount
      const discountPercentage = coupon.DiscountPercentage;
      const discountAmount = (gstDetail.amount * discountPercentage) / 100;
      const updatedAmount = gstDetail.amount - discountAmount;
      const updatedGstAmount = (updatedAmount * gstDetail.gst) / 100;
      const updatedTaxableValue = updatedAmount - updatedGstAmount;
  
      // Update the GST detail with discounted values
      gstDetail.amount = updatedAmount;
      gstDetail.gstAmount = updatedGstAmount;
      gstDetail.taxableValue = updatedTaxableValue;
      gstDetail.updatedOn = new Date();
      gstDetail.remarks = `Coupon "${couponCode}" applied: ${discountPercentage}% discount.`;
  
      await gstDetail.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({
        success: true,
        message: "Coupon applied successfully.",
        data: {
          originalAmount: gstDetail.amount + discountAmount,
          discountPercentage,
          discountAmount,
          updatedGstDetails: gstDetail,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
  
      console.error("Error applying coupon:", error.message);
      res.status(500).json({
        success: false,
        message: "Error applying coupon to GST details.",
        error: error.message,
      });
    }
  };
  
