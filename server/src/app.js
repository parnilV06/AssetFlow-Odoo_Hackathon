const express = require('express');
const cors = require('cors');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded data

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running smoothly' });
});

// We will mount other routes here later

module.exports = app;
