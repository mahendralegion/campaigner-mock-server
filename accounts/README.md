# Accounts Mock Server for Campaigner API

This is a dedicated mock server for testing account management functionality of the Campaigner API.

## Features

- Create new subaccounts
- Create new integration keys
- Simulate error responses (400, 401, 403, 422, 429, 500)

## Project Structure 

## Simulating Error Responses

### For Create Subaccount

- **403 Forbidden - Account not authorized for subaccount creation**:
  - Set `X-Account-Id` header to "123456789"
  - Or add query parameter `?accountId=123456789`

- **422 Unprocessable Entity - Missing required fields**:
  - Omit required fields (companyName, firstName, lastName, email, userName, password, securityQuestionType, securityQuestionAnswer)

// ... other error cases ... 