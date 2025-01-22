const { v4: uuidv4 } = require("uuid");

exports.generateOrderId = async function generateOrderId() {
  const uuid = uuidv4().replace(/-/g, ""); // Generate a UUID and remove dashes
  const shortUuid = uuid.slice(0, 20); // Truncate to 20 characters
  const timestamp = Date.now().toString().slice(-12); // Use the last 12 digits of the timestamp
  const orderId = `${shortUuid}${timestamp}`; // Concatenate the UUID and timestamp
  return orderId; // Length will be exactly 32 characters
};
