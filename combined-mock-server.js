const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./campainger-openapi-swagger.json');
const smsRoutes = require('./sms/routes/send');
const campaignRoutes = require('./sms/routes/campaign');
const subaccountRoutes = require('./accounts/routes/subaccount');
const integrationRoutes = require('./accounts/auth/integration');

const app = express();
const port = process.env.PORT || 3010;

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

// Define routes
// SMS routes
app.post('/sms/v1/send/single', smsRoutes.sendSingle);
app.post('/sms/v1/campaign', campaignRoutes.createCampaign);
app.put('/sms/v1/campaign/:id/recipients', campaignRoutes.setCampaignRecipients);

// Account routes
const originalCreateSubaccount = subaccountRoutes.createSubaccount;

app.post('/accounts/v1/subaccount', (req, res, next) => {
  // Simulate 403 error - Account not authorized for subaccount creation
  const accountId = req.headers["x-account-id"] || req.query.accountId;
  if (accountId === "123456789") {
    console.log("Simulating 403 error: Account not authorized for subaccount creation");
    return res.status(403).json({
      responseCode: 6,
      responseDetails: "You are not authorized to make API request for account id: 123456789",
      responseMessage: "Account is not setup for creating sub accounts."
    });
  }
  
  // Call the original handler
  return originalCreateSubaccount(req, res, next);
});

// Auth routes
app.post('/auth/v1/integration/key', integrationRoutes.createIntegrationKey);

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
  
  console.log("No specific handler matched, using default response");
  console.log("Sending response:", statusCode, responseData);
  
  res.status(statusCode).json(responseData);
});

// Start server
app.listen(port, () => {
  console.log(`Combined Mock Server running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/docs`);
}); 