const createEmailCampaign = (req, res) => {
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

  // Validate request body
  const { name, content } = req.body;
  if (!name || !content) {
    return res.status(400).json({
      errorCode: 'MISSING_FIELDS',
      errorMessage: 'Name and content are required'
    });
  }

  // Simulate campaign creation
  const campaignId = Date.now();
  console.log(`Created email campaign ${campaignId}`);
  return res.status(201).json({
    campaignId,
    campaignName: name,
    status: "DRAFT"
  });
};

module.exports = {
  createEmailCampaign,
  registerCreateRoute: (app) => {
    app.post('/email/v1/campaign', createEmailCampaign);
  }
}; 