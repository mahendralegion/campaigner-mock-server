const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../campainger-openapi-swagger.json');
const sendRoutes = require('./routes/send');
const campaignRoutes = require('./routes/campaign');
const subaccountRoutes = require('../accounts/routes/subaccount');
const integrationRoutes = require('../accounts/auth/integration');
const { registerContactRoutes } = require('../contact/handlers');

const app = express();
const port = process.env.PORT || 3008;

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/swagger', (req, res) => res.json(swaggerDocument));

// Basic middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Parse JSON body
app.use(express.json());

// Create routers
const smsRouter = express.Router();
const accountsRouter = express.Router();
const authRouter = express.Router();

// Define SMS routes
smsRouter.post('/v1/send/single', sendRoutes.sendSingle);
smsRouter.post('/v1/campaign', campaignRoutes.createCampaign);
smsRouter.put('/v1/campaign/:id/recipients', campaignRoutes.setCampaignRecipients);

// Define account routes
accountsRouter.post('/v1/subaccount', subaccountRoutes.createSubaccount);

// Define auth routes
authRouter.post('/v1/integration/key', integrationRoutes.createIntegrationKey);

// Register routers
app.use('/sms', smsRouter);
app.use('/accounts', accountsRouter);
app.use('/auth', authRouter);

// Log registered routes
console.log("Routes defined:");
console.log("- POST /sms/v1/send/single");
console.log("- POST /sms/v1/campaign");
console.log("- PUT /sms/v1/campaign/:id/recipients");
console.log("- POST /accounts/v1/subaccount");
console.log("- POST /auth/v1/integration/key");

// Register contact routes
registerContactRoutes(app);

// Generic handler for all other routes
app.all('*', (req, res) => {
  const path = req.path;
  const method = req.method;
  
  console.log("Raw request URL:", req.url);
  console.log("Request path:", path);
  console.log("Request method:", method);
  console.log("Request headers:", JSON.stringify(req.headers));
  console.log("Request body:", JSON.stringify(req.body));
  
  let responseData = { message: "Mock response" };
  let statusCode = 200;
  
  // Generic handlers as fallback
  if (method === 'POST' && path.includes('/campaign')) {
    console.log("Generic campaign endpoint matched!");
    statusCode = 201;
    responseData = { id: Math.floor(Math.random() * 100000) };
  }
  else if (method === 'PUT' || method === 'PATCH') {
    console.log("Generic PUT/PATCH endpoint matched!");
    statusCode = 204;
    responseData = null;
  }
  else {
    console.log("No specific handler matched, using default response");
  }
  
  console.log("Sending response:", statusCode, responseData);
  
  // Send response
  if (statusCode === 204) {
    res.status(statusCode).end();
  } else {
    res.status(statusCode).json(responseData);
  }
});

// Instead of using the imported route handler
app.post('/accounts/v1/subaccount', (req, res) => {
  console.log("Subaccount route handler called directly");
  
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
});

// Instead of using the imported route handler for integration key
app.post('/auth/v1/integration/key', (req, res) => {
  console.log("Integration key route handler called directly");
  
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
  
  // Generate a new integration key (without the "key-" prefix)
  const newKey = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
  // Normal successful response
  const responseData = {
    integrationKey: newKey
  };
  
  console.log("Sending response:", 200, responseData);
  res.status(200).json(responseData);
});

// Start server
app.listen(port, () => {
  console.log(`SMS Mock Server running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/docs`);
}); 