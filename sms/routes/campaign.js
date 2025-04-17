/**
 * SMS campaign route handlers
 */

// Store existing campaign names to check for duplicates
const existingCampaignNames = [
  "Existing Campaign",
  "Test Campaign",
  "Duplicate Campaign",
  "Marketing Campaign"
];

// Handler for creating an SMS campaign
const createCampaign = (req, res) => {
  console.log("SMS campaign creation endpoint matched!");
  
  // Check for error conditions based on request
  const { name, contents } = req.body;
  
  // Simulate 400 error - Campaign name already exists (deterministic)
  if (name && (existingCampaignNames.includes(name) || name.toLowerCase() === "duplicate")) {
    console.log("Simulating 400 error: Campaign name already exists");
    return res.status(400).json({
      response_code: 102,
      response_message: `${name} already exists`,
      response_details: `Another SMS campaign with ${name} already exists on the account. Please specify another unique value for: name`
    });
  }
  
  // Add the new campaign name to our list of existing names
  if (name) {
    existingCampaignNames.push(name);
    console.log("Added campaign name to existing list:", name);
    console.log("Current campaign names:", existingCampaignNames);
  }
  
  // Simulate 400 error - Missing required fields
  if (!name || !contents) {
    console.log("Simulating 400 error: Missing required fields");
    return res.status(400).json({
      response_code: 103,
      response_message: "Missing required fields",
      response_details: "The request is missing required fields: name and/or contents"
    });
  }
  
  // Simulate 400 error - Invalid content type
  if (contents && contents.contentSourceType && 
      !["Template", "Campaign", "Custom"].includes(contents.contentSourceType)) {
    console.log("Simulating 400 error: Invalid content source type");
    return res.status(400).json({
      response_code: 104,
      response_message: "Invalid content source type",
      response_details: "The contentSourceType must be one of: Template, Campaign, Custom"
    });
  }
  
  // Simulate 401 error - Invalid integration key (based on header)
  const integrationKey = req.headers.integrationkey;
  if (integrationKey === "INVALID_KEY") {
    console.log("Simulating 401 error: Invalid integration key");
    return res.status(401).json({
      response_code: 401,
      response_message: "Unauthorized",
      response_details: "The Integration Key is invalid or inactive"
    });
  }
  
  // Simulate 403 error - Account inactive (based on header)
  const accountId = req.headers["x-account-id"];
  if (accountId === "INACTIVE_ACCOUNT") {
    console.log("Simulating 403 error: Account inactive");
    return res.status(403).json({
      response_code: 403,
      response_message: "Forbidden",
      response_details: "Account is inactive"
    });
  }
  
  // Simulate 429 error - Too many requests (based on specific trigger)
  if (name && name.toLowerCase().includes("ratelimit")) {
    console.log("Simulating 429 error: Too many requests");
    return res.status(429).json({
      response_code: 429,
      response_message: "Too Many Requests",
      response_details: "API rate limit exceeded. Please try again later."
    });
  }
  
  // Simulate 500 error - Internal server error (based on specific trigger)
  if (name && name.toLowerCase().includes("error")) {
    console.log("Simulating 500 error: Internal server error");
    return res.status(500).json({
      response_code: 500,
      response_message: "Internal Server Error",
      response_details: "An unexpected error occurred while processing the request."
    });
  }
  
  // Normal successful response
  const campaignId = Math.floor(Math.random() * 100000);
  const responseData = {
    smsCampaignId: campaignId
  };
  
  console.log("Sending response:", 201, responseData);
  res.status(201).json(responseData);
};

// Handler for setting SMS campaign recipients
const setCampaignRecipients = (req, res) => {
  console.log("SMS campaign recipients endpoint matched!");
  
  const campaignId = req.params.id;
  
  // Simulate 400 error - Campaign in invalid status
  if (campaignId === "12345") {
    console.log("Simulating 400 error: Campaign in invalid status");
    return res.status(400).json({
      response_code: 126,
      response_message: "SMS Campaign is in Sending status and cannot be updated",
      response_details: "Cannot set recipients for SMS campaign."
    });
  }
  
  // Simulate 400 error - Invalid request parameters
  if (req.body.sendToAllContacts === true && req.body.listIds && req.body.listIds.length > 0) {
    console.log("Simulating 400 error: Invalid request parameters");
    return res.status(400).json({
      response_code: 127,
      response_message: "User has provided sendToAllContacts as true and listIds is also present",
      response_details: "When sendToAllContacts is true, listIds should not be provided."
    });
  }
  
  // Simulate 404 error - Campaign not found
  if (campaignId === "99999") {
    console.log("Simulating 404 error: Campaign not found");
    return res.status(404).json({
      response_code: 404,
      response_message: "Not Found",
      response_details: "SMS Campaign id is invalid, there is no undeleted SMS campaign with the specified campaign id on the account"
    });
  }
  
  // Normal successful response
  console.log("Sending response:", 204, null);
  res.status(204).end();
};

module.exports = {
  createCampaign,
  setCampaignRecipients
}; 