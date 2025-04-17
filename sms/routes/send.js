/**
 * SMS sending route handlers
 */

// Handler for sending a single SMS
const sendSingle = (req, res) => {
  console.log("SMS send endpoint matched!");
  
  // Check for error conditions based on request
  const { mobilePhone, messageContent } = req.body;
  
  // Simulate 400 error - Missing required fields
  if (!mobilePhone || !messageContent) {
    console.log("Simulating 400 error: Missing required fields");
    return res.status(400).json({
      response_code: 103,
      response_message: "Missing required fields",
      response_details: "The request is missing required fields: mobilePhone and/or messageContent"
    });
  }
  
  // Simulate 400 error - Invalid phone number format
  if (mobilePhone && !/^\d{10,15}$/.test(mobilePhone)) {
    console.log("Simulating 400 error: Invalid phone number format");
    return res.status(400).json({
      response_code: 105,
      response_message: "Invalid phone number format",
      response_details: "The mobilePhone must be a valid phone number with 10-15 digits"
    });
  }
  
  // Simulate 401 error - Invalid integration key (based on header)
  const integrationKey = req.headers.integrationkey;
  if (integrationKey === "INVALID_KEY") {
    console.log("Simulating 401 error: Invalid integration key");
    return res.status(401).json({
      response_code: 401,
      response_message: "Unauthorized",
      response_details: "The Integration Key is invalid or inactive"
    });
  }
  
  // Simulate 403 error - Account inactive (based on header)
  const accountId = req.headers["x-account-id"];
  if (accountId === "INACTIVE_ACCOUNT") {
    console.log("Simulating 403 error: Account inactive");
    return res.status(403).json({
      response_code: 403,
      response_message: "Forbidden",
      response_details: "Account is inactive"
    });
  }
  
  // Normal successful response
  const responseData = {
    mobilePhone: mobilePhone,
    smsMessageId: `sms-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  };
  
  console.log("Sending response:", 200, responseData);
  res.status(200).json(responseData);
};

module.exports = {
  sendSingle
}; 