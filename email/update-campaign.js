const updateEmailCampaign = (req, res) => {
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

  // Validate campaign ID
  const campaignId = req.params.id;
  if (!campaignId || isNaN(campaignId)) {
    return res.status(400).json({
      errorCode: 'INVALID_ID',
      errorMessage: 'Invalid campaign ID format'
    });
  }

  // Simulate campaign update
  console.log(`Updated email campaign ${campaignId}`);
  return res.status(200).json({
    campaignId: parseInt(campaignId),
    status: req.body.status || "UPDATED"
  });
};

module.exports = {
  updateEmailCampaign,
  registerUpdateRoute: (app) => {
    app.patch('/email/v1/campaign/:id', updateEmailCampaign);
  }
}; 