const crypto = require("crypto");

/**
 * Compute X-Verify header.
 * @param {string} payload - The JSON payload as a string.
 * @param {string} saltKey - The Salt Key.
 * @param {string} saltIndex - The Salt Index.
 * @returns {string} - The X-Verify header value.
 */
function computeXVerify(payload, saltKey, saltIndex) {
    // Step 1: Base64 encode the payload
    const base64Payload = Buffer.from(payload).toString("base64");
    console.log("base64 encoded:---------", base64Payload);
    // Step 2: Concatenate Base64 payload, endpoint, and salt key with parentheses
    const dataToHash = `${base64Payload}/pg/v1/pay${saltKey}`;
    console.log("data to hash :---------------------------",dataToHash);
    // Step 3: Compute SHA-256 hash
    const sha256Hash = crypto.createHash("sha256").update(dataToHash).digest("hex");
    console.log("sha256:--------------------",sha256Hash);
    // Step 4: Append Salt Index
    return `${sha256Hash}###${saltIndex}`;
}

module.exports = computeXVerify


