# Install Mockoon CLI
npm install -g @mockoon/cli

# Import your OpenAPI spec and start the server
mockoon import --from campainger-openapi-swagger.json --format openapi --output campaigner-mock
mockoon start --data campaigner-mock 