const Payment = require('../models/Payment'); // Adjust the path to your Payment model

// Create Payment
exports.createPayment = async (req, res) => {
  const { Amount, Type } = req.body;

  try {
    // Create new payment
    const payment = new Payment({
      Amount,
      Type,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
      IsDeleted: false,
      IsActive: true,
    });

    // Save payment to database
    await payment.save();
    console.log("Payment created:", payment);

    res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment creation error:", error.message);
    res.status(500).json({
      success: false,
      error: "Payment creation failed.",
      details: error.message,
    });
  }
};

// Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ IsDeleted: false });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payments.",
      details: error.message,
    });
  }
};

// Get Payment by ID
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment || payment.IsDeleted) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment.",
      details: error.message,
    });
  }
};

// Update Payment
exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { Amount, Type, IsActive } = req.body;

  try {
    const payment = await Payment.findById(id);
    if (!payment || payment.IsDeleted) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment details
    payment.Amount = Amount !== undefined ? Amount : payment.Amount;
    payment.Type = Type !== undefined ? Type : payment.Type;
    payment.IsActive = IsActive !== undefined ? IsActive : payment.IsActive;
    payment.UpdatedOn = new Date();

    // Save updated payment
    await payment.save();
    console.log("Payment updated:", payment);

    res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment update error:", error.message);
    res.status(500).json({
      success: false,
      error: "Payment update failed.",
      details: error.message,
    });
  }
};

// Soft Delete Payment
exports.deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment || payment.IsDeleted) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Soft delete payment
    payment.IsDeleted = true;
    payment.UpdatedOn = new Date();

    // Save deleted payment
    await payment.save();
    console.log("Payment deleted:", payment);

    res.status(200).json({
      message: "Payment deleted successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment deletion error:", error.message);
    res.status(500).json({
      success: false,
      error: "Payment deletion failed.",
      details: error.message,
    });
  }
};
