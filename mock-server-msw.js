const { setupServer } = require('msw/node');
const { rest } = require('msw');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./campainger-openapi-swagger.json');

const app = express();
const port = 3000;

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/swagger', (req, res) => res.json(swaggerDocument));

// Define mock handlers
const handlers = [
  // Auth - Create Integration Key
  rest.post('https://api.campaigner.com/auth/v1/integration/key', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        integrationKey: "mock-integration-key-12345"
      })
    );
  }),
  
  // Email - Create Email Campaign
  rest.post('https://api.campaigner.com/email/v1/campaign', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        emailCampaignId: 12345
      })
    );
  }),
  
  // Email - Update Email Campaign
  rest.patch('https://api.campaigner.com/email/v1/campaign/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(204)
    );
  }),
  
  // Email - Set Recipients
  rest.put('https://api.campaigner.com/email/v1/campaign/:id/recipients', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(204)
    );
  }),
  
  // SMS - Create SMS Campaign
  rest.post('https://api.campaigner.com/sms/v1/campaign', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        smsCampaignId: 6789
      })
    );
  }),
  
  // SMS - Set Recipients
  rest.put('https://api.campaigner.com/sms/v1/campaign/:id/recipients', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(204)
    );
  }),
  
  // Contacts - Get Contacts
  rest.get('https://api.campaigner.com/contacts/v1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        contacts: [
          {
            contactId: 123456,
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            mobilePhone: "1234567890"
          },
          {
            contactId: 789012,
            email: "jane@example.com",
            firstName: "Jane",
            lastName: "Smith",
            mobilePhone: "0987654321"
          }
        ]
      })
    );
  })
];

// Set up the server
const server = setupServer(...handlers);
server.listen();

// Start Express server
app.listen(port, () => {
  console.log(`Campaigner mock server running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/docs`);
});

// Clean up on exit
process.on('exit', () => {
  server.close();
}); 