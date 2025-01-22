const Coupon = require("../models/Coupon");


exports.GetFinalAmount = async (CouponName) => {
    try {
        const couponDetails = await Coupon.findOne({ CouponName });
        if(!couponDetails){
          return res.status(400).json({ success: false, message: "Coupon not found" });
        }
        const amount = (couponDetails.DiscountPercentage*1000)/100;
        return amount
      } catch (error) {
        console.log(error)
        return error.message
      }
}