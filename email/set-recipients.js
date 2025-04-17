const setCampaignRecipients = (req, res) => {
  console.log('[DEBUG] Received headers:', JSON.stringify(req.headers));
  console.log('[DEBUG] Request body:', JSON.stringify(req.body));

  const integrationKey = req.headers.integrationkey?.toUpperCase();
  console.log(`[DEBUG] IntegrationKey value: ${integrationKey || 'MISSING'}`);

  if (!integrationKey) {
    console.log('[AUTH] Blocking request: Missing integration key');
    return res.status(401).json({ 
      errorCode: 'MISSING_AUTH',
      errorMessage: 'Integration key header is required' 
    });
  }

  if (integrationKey !== 'VALID_KEY') {
    console.log(`[AUTH] Blocking request: Invalid key "${integrationKey}"`);
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

  // Validate request body
  const { sendToAllContacts, listIds, exclusionListIds } = req.body;
  
  // Check for conflicting parameters
  if (sendToAllContacts && listIds) {
    return res.status(400).json({
      errorCode: 'CONFLICTING_PARAMS',
      errorMessage: 'Cannot specify both sendToAllContacts and listIds'
    });
  }

  // Check for missing required parameters
  if (!sendToAllContacts && !listIds) {
    return res.status(400).json({
      errorCode: 'MISSING_PARAMS',
      errorMessage: 'Must specify either sendToAllContacts or listIds'
    });
  }

  // Validate list IDs
  if (listIds) {
    if (!Array.isArray(listIds)) {
      return res.status(400).json({
        errorCode: 'INVALID_LIST_IDS',
        errorMessage: 'listIds must be an array'
      });
    }
    
    if (listIds.some(id => id === 999)) {
      return res.status(400).json({
        errorCode: 'INVALID_LIST_ID',
        errorMessage: 'Invalid list ID: 999'
      });
    }
  }

  // Validate exclusion lists
  if (exclusionListIds) {
    if (!Array.isArray(exclusionListIds)) {
      return res.status(400).json({
        errorCode: 'INVALID_EXCLUSION_IDS',
        errorMessage: 'exclusionListIds must be an array'
      });
    }
  }

  // Only return 204 when ALL validations pass
  console.log('204 Success: Valid recipients update');
  return res.status(204).send();
};

module.exports = {
  setCampaignRecipients,
  registerRecipientsRoute: (app) => {
    app.put('/email/v1/campaign/:id/recipients', setCampaignRecipients);
  }
}; 