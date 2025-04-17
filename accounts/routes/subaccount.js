/**
 * Subaccount route handlers
 */

// Handler for creating a new subaccount
const createSubaccount = (req, res) => {
  console.log("Create subaccount endpoint matched!");
  
  // Check for error conditions based on request
  const { 
    companyName, 
    firstName, 
    lastName, 
    email, 
    userName, 
    password, 
    securityQuestionType, 
    securityQuestionAnswer 
  } = req.body;
  
  // Simulate 403 error - Account not authorized for subaccount creation
  // Check for specific account ID in the header or URL
  const accountId = req.headers["x-account-id"] || req.query.accountId;
  if (accountId === "123456789") {
    console.log("Simulating 403 error: Account not authorized for subaccount creation");
    return res.status(403).json({
      responseCode: 6,
      responseDetails: "You are not authorized to make API request for account id: 123456789",
      responseMessage: "Account is not setup for creating sub accounts."
    });
  }
  
  // Simulate 422 error - Missing required fields
  if (!companyName || !firstName || !lastName || !email || !userName || !password || 
      !securityQuestionType || !securityQuestionAnswer) {
    console.log("Simulating 422 error: Missing required fields");
    return res.status(422).json({
      errorFlag: true,
      returnCode: "M_1.1.1_MISSING_REQUIRED_FIELD",
      returnMessage: "Missing required field(s).",
      subAccountId: null
    });
  }
  
  // Simulate 422 error - Invalid email format
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log("Simulating 422 error: Invalid email format");
    return res.status(422).json({
      errorFlag: true,
      returnCode: "M_1.1.1_INVALID_EMAIL",
      returnMessage: "Invalid email format.",
      subAccountId: null
    });
  }
  
  // Simulate 422 error - Username already exists
  if (userName && (userName === "existing" || userName === "taken" || userName === "admin")) {
    console.log("Simulating 422 error: Username already exists");
    return res.status(422).json({
      errorFlag: true,
      returnCode: "M_1.1.1_USERNAME_EXISTS",
      returnMessage: "Username already exists.",
      subAccountId: null
    });
  }
  
  // Simulate 422 error - Password too weak
  if (password && password.length < 8) {
    console.log("Simulating 422 error: Password too weak");
    return res.status(422).json({
      errorFlag: true,
      returnCode: "M_1.1.1_WEAK_PASSWORD",
      returnMessage: "Password must be at least 8 characters long.",
      subAccountId: null
    });
  }
  
  // Simulate 422 error - Invalid security question type
  const validQuestionTypes = ["BIRTH_CITY", "FIRST_PET", "MOTHER_MAIDEN_NAME", "FAVORITE_TEACHER", "FAVORITE_MOVIE"];
  if (securityQuestionType && !validQuestionTypes.includes(securityQuestionType)) {
    console.log("Simulating 422 error: Invalid security question type");
    return res.status(422).json({
      errorFlag: true,
      returnCode: "M_1.1.1_INVALID_SECURITY_QUESTION",
      returnMessage: "Invalid security question type.",
      subAccountId: null
    });
  }
  
  // Simulate 401 error - Invalid integration key (based on header)
  const integrationKey = req.headers.integrationkey;
  if (integrationKey === "INVALID_KEY") {
    console.log("Simulating 401 error: Invalid integration key");
    return res.status(401).json({
      errorFlag: true,
      returnCode: "M_1.1.1_UNAUTHORIZED",
      returnMessage: "Unauthorized. Invalid integration key.",
      subAccountId: null
    });
  }
  
  // Simulate 403 error - Account inactive (based on header)
  if (accountId === "INACTIVE_ACCOUNT") {
    console.log("Simulating 403 error: Account inactive");
    return res.status(403).json({
      errorFlag: true,
      returnCode: "M_1.1.1_FORBIDDEN",
      returnMessage: "Forbidden. Account is inactive.",
      subAccountId: null
    });
  }
  
  // Simulate 429 error - Too many requests (based on specific trigger)
  if (companyName && companyName.toLowerCase().includes("ratelimit")) {
    console.log("Simulating 429 error: Too many requests");
    return res.status(429).json({
      errorFlag: true,
      returnCode: "M_1.1.1_TOO_MANY_REQUESTS",
      returnMessage: "Too many requests. Please try again later.",
      subAccountId: null
    });
  }
  
  // Simulate 500 error - Internal server error (based on specific trigger)
  if (companyName && companyName.toLowerCase().includes("error")) {
    console.log("Simulating 500 error: Internal server error");
    return res.status(500).json({
      errorFlag: true,
      returnCode: "M_1.1.1_INTERNAL_ERROR",
      returnMessage: "Internal server error.",
      subAccountId: null
    });
  }
  
  // Normal successful response
  const subAccountId = Math.floor(Math.random() * 1000000);
  const responseData = {
    errorFlag: false,
    returnCode: "M_1.1.1_SUCCESS",
    returnMessage: "Success.",
    subAccountId: subAccountId
  };
  
  console.log("Sending response:", 200, responseData);
  res.status(200).json(responseData);
};

module.exports = {
  createSubaccount
}; 