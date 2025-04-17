Campaigner is a tool for creating and managing email and sms campaigns.


## Features

- Create and manage email and sms campaigns
- Schedule campaigns to send at a specific time
- Track campaign performance
- Create and manage email and sms templates
- Create and manage email and sms lists


## Mock server 

in order to test the campaigner app, we need to have a mock server that can be used to send emails and sms messages.


REST API:

https://api.campaigner.com/docs/


Swagger UI:

https://api.campaigner.com/docs/swagger/


## Documentation

- **API Reference**: [https://api.campaigner.com/docs/](https://api.campaigner.com/docs/)
- **Swagger UI**: [https://api.campaigner.com/docs/swagger/](https://api.campaigner.com/docs/swagger/)
- **Project Structure**:
  ```
  .
  ├── contact/
  │   └── handlers.js         # Contact management endpoints
  ├── email/
  │   ├── create-campaign.js  # Email campaign creation
  │   ├── update-campaign.js  # Email campaign updates
  │   └── set-recipients.js   # Email campaign recipients
  ├── sms/
  │   └── handlers.js         # SMS campaign endpoints
  ├── server.js               # Main server configuration
  ├── package.json            # Dependencies and scripts
  └── README.md               # Documentation
  ```

---

For additional support or to report issues, please contact support@campaigner.com or open an issue on GitHub

## Troubleshooting

### Common Issues

- **Port already in use**: Change the port in `.env` or use `PORT=3009 node server.js`
- **404 Not Found**: Check the URL path and ensure it matches the registered routes
- **Route conflicts**: Ensure specific routes are registered before generic handlers
- **Authentication errors**: Verify the `IntegrationKey` and `X-Account-ID` headers

### Debug Mode

Enable debug logging:


## Error Simulation

The mock server can simulate various error scenarios:

| Scenario | How to Trigger | Response |
|----------|---------------|----------|
| Authentication failure | Use `INVALID_KEY` | 401 Unauthorized |
| Inactive account | Use `X-Account-ID: INACTIVE_ACCOUNT` | 403 Forbidden |
| Invalid campaign ID | Use ID `999` | 404 Not Found |
| Invalid list ID | Include list ID `999` | 400 Bad Request |
| Missing required fields | Omit required fields | 400 Bad Request |
| Conflicting parameters | Use both `sendToAllContacts: true` and `listIds` | 400 Bad Request |

## Customization

### Response Customization

You can customize mock responses by modifying the handler files:

- Email campaign handlers: `email/create-campaign.js`, `email/update-campaign.js`, `email/set-recipients.js`
- Contact handlers: `contact/handlers.js`
- SMS handlers: `sms/handlers.js`

### Adding New Endpoints

To add a new endpoint:

1. Create a new handler file in the appropriate directory
2. Export a handler function and registration function
3. Import and register the route in `server.js`

Example:


