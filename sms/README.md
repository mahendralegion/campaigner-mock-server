# SMS Mock Server for Campaigner API

This is a dedicated mock server for testing SMS functionality of the Campaigner API.

## Features

- Send single SMS messages
- Create SMS campaigns
- Set recipients for SMS campaigns
- Simulate error responses (400, 401, 403, 404, 429, 500)

## Project Structure 

## Simulating Error Responses

### For Create SMS Campaign

- **400 Bad Request - Campaign name already exists**:
  - Use one of these campaign names: "Existing Campaign", "Test Campaign", "Duplicate Campaign", "Marketing Campaign"
  - Or use any name containing "duplicate" (case insensitive)
  - Or reuse a campaign name you've already used in this session

- **400 Bad Request - Missing required fields**:
  - Omit required fields (`name` or `contents`)

- **400 Bad Request - Invalid content type**:
  - Set `contents.contentSourceType` to a value other than "Template", "Campaign", or "Custom"

- **401 Unauthorized**:
  - Set `IntegrationKey` header to "INVALID_KEY"

- **403 Forbidden**:
  - Set `X-Account-Id` header to "INACTIVE_ACCOUNT"

- **429 Too Many Requests**:
  - Use a campaign name containing "ratelimit" (case insensitive)

- **500 Internal Server Error**:
  - Use a campaign name containing "error" (case insensitive) 