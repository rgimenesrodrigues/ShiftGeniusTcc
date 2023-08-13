const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');

// Serve static files from the 'Resources' directory
app.use(express.static(path.join(__dirname, 'Resources')));

// Endpoint to handle Salesforce callback
app.get('/callback', async (req, res) => {
  const salesforcePageUrl = 'https://axyz4-dev-ed.develop.my.salesforce.com/apex/RedirectLogin';
  res.redirect(salesforcePageUrl);
});


// Load SSL certificate and key
const privateKey = fs.readFileSync(path.join(__dirname, '/Resources/Certificates','server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '/Resources/Certificates','server.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Serve index.html from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/Resources/Pages', 'index.html'));
});

// Start the HTTPS server
const httpsServer = https.createServer(credentials, app);
const port = 4343; // Change the port to your desired port number
httpsServer.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
