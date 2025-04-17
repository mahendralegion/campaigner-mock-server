const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../campainger-openapi-swagger.json');
const subaccountRoutes = require('./routes/subaccount');
const integrationRoutes = require('./auth/integration');

const app = express();
const port = process.env.PORT || 3009;

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
const accountsRouter = express.Router();
const authRouter = express.Router();

// Define account routes
accountsRouter.post('/v1/subaccount', subaccountRoutes.createSubaccount);

// Define auth routes
authRouter.post('/v1/integration/key', integrationRoutes.createIntegrationKey);

// Register routers
app.use('/accounts', accountsRouter);
app.use('/auth', authRouter);

// Log registered routes
console.log("Routes defined:");
console.log("- POST /accounts/v1/subaccount");
console.log("- POST /auth/v1/integration/key");

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
  console.log(`Accounts Mock Server running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/docs`);
}); 