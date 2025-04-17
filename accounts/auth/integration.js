/**
 * Integration key route handlers
 */

// Store existing integration keys to check for duplicates
const existingKeys = [];

// Handler for creating a new integration key
const createIntegrationKey = (req, res) => {
  console.log("Create integration key endpoint matched!");
  
  // Check for error conditions based on request
  const { description, isActive } = req.body;
  
  // Simulate 400 error - Description is more than 4000 characters
  if (description && description.length > 4000) {
    console.log("Simulating 400 error: Description too long");
    return res.status(400).json({
      errorCode: "DESCRIPTION_TOO_LONG",
      errorMessage: "Description is more than 4000 characters",
      details: "The description field must be 4000 characters or less"
    });
  }
  
  // Simulate 401 error - Invalid integration key (based on header)
  const integrationKey = req.headers.integrationkey;
  if (integrationKey === "INVALID_KEY") {
    console.log("Simulating 401 error: Invalid integration key");
    return res.status(401).json({
      errorCode: "INVALID_INTEGRATION_KEY",
      errorMessage: "Integration Key supplied for the API call with any Campaigner account",
      details: "The Integration Key is invalid or inactive"
    });
  }
  
  // Simulate 403 error - Account inactive (based on header)
  const accountId = req.headers["x-account-id"];
  if (accountId === "INACTIVE_ACCOUNT") {
    console.log("Simulating 403 error: Account inactive");
    return res.status(403).json({
      errorCode: "ACCOUNT_INACTIVE",
      errorMessage: "Account is not active",
      details: "The account associated with this request is inactive"
    });
  }
  
  // Simulate 429 error - Too many requests (based on specific trigger)
  if (description && description.toLowerCase().includes("ratelimit")) {
    console.log("Simulating 429 error: Too many requests");
    return res.status(429).json({
      errorCode: "TOO_MANY_REQUESTS",
      errorMessage: "Too many requests",
      details: "API rate limit exceeded. Please try again later."
    });
  }
  
  // Simulate 500 error - Internal server error (based on specific trigger)
  if (description && description.toLowerCase().includes("error")) {
    console.log("Simulating 500 error: Internal server error");
    return res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: "Internal error while processing the request",
      details: "An unexpected error occurred while processing the request."
    });
  }
  
  // Generate a new integration key (without the "key-" prefix)
  const newKey = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  existingKeys.push(newKey);
  
  // Normal successful response
  const responseData = {
    integrationKey: newKey
  };
  
  console.log("Sending response:", 200, responseData);
  res.status(200).json(responseData);
};

module.exports = {
  createIntegrationKey,
  registerRoutes: (app) => {
    app.post('/integration-keys', createIntegrationKey);
  }
}; 