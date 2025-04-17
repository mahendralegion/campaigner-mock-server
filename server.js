const express = require('express');
const app = express();
app.use(express.json());

// Import routes FIRST
const { registerContactRoutes } = require('./contact/handlers');
const { registerCreateRoute } = require('./email/create-campaign');
const { registerUpdateRoute } = require('./email/update-campaign');
const { registerRecipientsRoute } = require('./email/set-recipients');

// Register email routes BEFORE generic handlers
registerCreateRoute(app);
registerUpdateRoute(app);
registerRecipientsRoute(app);

// Register specific routes BEFORE default handler
registerContactRoutes(app);

// THEN add default handler (this must come AFTER specific routes)
app.use((req, res) => {
  console.log('No specific handler matched, using default response');
  res.status(200).json({ message: 'Mock response' });
});

// Add this check to ensure no conflicting routes
app._router.stack.forEach(route => {
  if (route.route?.path === '/contacts/v1/:id') {
    console.log('Contact route registered:', route.route.path);
  }
});

// Add right after registerContactRoutes(app)
console.log('Registered routes:');
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    console.log(`- ${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
  }
});

// Then register other SMS routes
require('./sms/handlers').registerSmsRoutes(app);

// After all route registrations
console.log('All registered routes:');
app._router.stack.forEach(layer => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`- [${methods}] ${layer.route.path}`);
  } else if (layer.name === 'router') {
    layer.handle.stack.forEach(sublayer => {
      const methods = Object.keys(sublayer.route.methods).join(', ').toUpperCase();
      console.log(`- [${methods}] ${sublayer.route.path}`);
    });
  }
});

// After all route registrations
console.log('Registered Email Campaign Routes:');
app._router.stack.forEach(layer => {
  if (layer.route && layer.route.path.includes('/email/v1/campaign')) {
    console.log(`- [${layer.route.stack[0].method.toUpperCase()}] ${layer.route.path}`);
  }
});

// Add after route registrations
console.log('Final route configuration:');
app._router.stack.forEach(layer => {
  if (layer.route) {
    console.log(
      `- [${layer.route.stack[0].method.toUpperCase()}] ${layer.route.path}`
    );
  }
});

// Add route verification
console.log('Registered recipients route:', 
  app._router.stack.some(layer => 
    layer.route?.path === '/email/v1/campaign/:id/recipients'
  )
);

// Add after route registrations
console.log('Registered PUT Handlers:');
app._router.stack.forEach(layer => {
  if (layer.route?.methods.put) {
    console.log(`PUT ${layer.route.path}`);
  }
});

// Add this to verify route registration
console.log('PUT Endpoints:');
app._router.stack.forEach(layer => {
  if (layer.route?.methods.put) {
    console.log(`- PUT ${layer.route.path}`);
  }
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 