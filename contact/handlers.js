const express = require('express');

const createContactHandler = (req, res) => {
  // Authentication check
  const integrationKey = req.headers.integrationkey;
  if (!integrationKey || integrationKey === 'INVALID_KEY') {
    return res.status(401).json({
      errorCode: 'INVALID_AUTH',
      errorMessage: 'Invalid integration key'
    });
  }

  // Account status check
  const accountId = req.headers['x-account-id'];
  if (accountId === 'INACTIVE_ACCOUNT') {
    console.log('Simulating 403 error: Account inactive');
    return res.status(403).json({
      errorCode: 'ACCOUNT_INACTIVE',
      errorMessage: 'Account is not active'
    });
  }

  // Request validation
  const { staticFields } = req.body;
  if (!staticFields?.email) {
    return res.status(400).json({
      errorCode: 'MISSING_EMAIL',
      errorMessage: 'Email is required in staticFields'
    });
  }

  // Success response
  console.log('Creating contact for email:', staticFields.email);
  return res.status(201).json({
    contactId: Date.now(),
    contactUniqueIdentifier: staticFields.email,
    staticFields
  });
};

const getContactHandler = (req, res) => {
  // Authentication check
  const integrationKey = req.headers.integrationkey;
  if (!integrationKey || integrationKey === 'INVALID_KEY') {
    return res.status(401).json({
      errorCode: 'INVALID_AUTH',
      errorMessage: 'Invalid integration key'
    });
  }

  // Account status check
  const accountId = req.headers['x-account-id'];
  if (accountId === 'INACTIVE_ACCOUNT') {
    return res.status(403).json({
      errorCode: 'ACCOUNT_INACTIVE',
      errorMessage: 'Account is not active'
    });
  }

  // Contact ID validation
  const contactId = req.params.id;
  if (!contactId || isNaN(contactId)) {
    return res.status(400).json({
      errorCode: 'INVALID_ID',
      errorMessage: 'Invalid contact ID format'
    });
  }

  // Simulate contact retrieval
  console.log(`Fetching contact ${contactId}`);
  return res.status(200).json({
    contactId: parseInt(contactId),
    contactUniqueIdentifier: `contact_${contactId}@example.com`,
    staticFields: {
      email: `contact_${contactId}@example.com`,
      firstName: "Test",
      lastName: "Contact"
    },
    status: "ACTIVE",
    lastModified: new Date().toISOString()
  });
};

module.exports = {
  createContactHandler,
  getContactHandler,
  registerContactRoutes: (app) => {
    const router = express.Router();
    router.post('/contacts/v1', createContactHandler);
    router.get('/contacts/v1/:id', getContactHandler);
    app.use(router);
  }
}; 