// Helper function to check if input is a valid email address
exports.isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  // Helper function to check if input is a valid phone number
  exports.isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust the regex based on your phone number format (e.g., 10 digits)
    return phoneRegex.test(phone);
  };