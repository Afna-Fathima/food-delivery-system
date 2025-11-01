const express = require('express');
const path = require('path');

const app = express();

// Serve static files from frontend/build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Handle all routes by serving index.html (for React Router)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frontend running on port ${PORT}`);
});
