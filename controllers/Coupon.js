const Coupon = require("../models/Coupon");

// Create a new coupon
exports.createCoupon = async (req, res) => {
  const { CoupenName, DiscountPercentage, EndsOn } = req.body;

  if (!CoupenName || !DiscountPercentage || !EndsOn) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCoupon = new Coupon({
      CoupenName,
      DiscountPercentage,
      EndsOn,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
    });

    await newCoupon.save();
    res.status(201).json({ message: "Coupon created successfully", data: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ message: "Coupons retrieved successfully", data: coupons });
  } catch (error) {
    console.error("Error retrieving coupons:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single coupon by ID
exports.getCouponById = async (req, res) => {
  const { id } = req.params;

  try {
    if(!id) return res.status(400).json({ message: "Coupon ID is required" });
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon retrieved successfully", data: coupon });
  } catch (error) {
    console.error("Error retrieving coupon:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a coupon
exports.updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { CoupenName, DiscountPercentage, EndsOn } = req.body;

  try {
    if(!id) return res.status(400).json({ message: "Coupon ID is required" });

    if (!CoupenName || !DiscountPercentage || !EndsOn) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.CoupenName = CoupenName || coupon.CoupenName;
    coupon.DiscountPercentage = DiscountPercentage || coupon.DiscountPercentage;
    coupon.EndsOn = EndsOn || coupon.EndsOn;
    coupon.UpdatedOn = new Date();

    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully", data: coupon });
  } catch (error) {
    console.error("Error updating coupon:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    if(!id) return res.status(400).json({ message: "Coupon ID is required" });
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify a coupon
exports.verifyCoupon = async (req, res) => {
    const { CoupenName } = req.body;
  
    if (!CoupenName) {
      return res.status(400).json({ message: "Coupon name is required" });
    }
  
    try {
      // Find the coupon by name
      const coupon = await Coupon.findOne({ CoupenName });
  
      if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon. Coupon not found." });
      }
  
      // Check if the coupon is expired
      const currentDate = new Date();
      if (currentDate > coupon.EndsOn) {
        return res.status(400).json({ message: "Coupon is expired." });
      }
  
      // Coupon is valid
      res.status(200).json({
        message: "Coupon is valid",
        data: {
          CoupenName: coupon.CoupenName,
          DiscountPercentage: coupon.DiscountPercentage,
          EndsOn: coupon.EndsOn,
        },
      });
    } catch (error) {
      console.error("Error verifying coupon:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

// validate using the CouponName if EndDate is expired or not and also return final amount after applying DiscountPercentage to 1000
exports.validateCoupon = async (req,res) => {
    // Find the coupon by name
    try {
      const {coupon} = req.params;
    const couponDetails = await Coupon.findOne({ CoupenName: coupon });
  
    if (!couponDetails) {
      return res.status(404).json({success:false, message: "Your coupon is not valid." });
    }
  
    // Check if the coupon is expired
    const currentDate = new Date();
    if (currentDate > couponDetails.EndsOn) {
      return res.status(400).json({ success:false, message: "Coupon is expired." });
    }
  
    // Calculate final amount after discount
    const finalAmount = 1000 - (1000 * couponDetails.DiscountPercentage) / 100;
    const discountAmount =1000-finalAmount

    res.status(200).json({success:true, message: "Coupon applied", data: { finalAmount, discountPercentage:couponDetails.DiscountPercentage, discountAmount } });
    } catch (error) {
      res.status(500).json({success:false, message: "Internal Server Error", error: error });
    }
};
  