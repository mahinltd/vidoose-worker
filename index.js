// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { port, nodeEnv } = require('./src/config/env');
const apiRoutes = require('./src/routes/apiRoutes'); // Added apiRoutes

const app = express();

// Security & Core Middlewares
app.use(helmet()); 
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
if (nodeEnv !== 'test') {
    app.use(morgan('combined'));
}

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Vidoose EC2 Worker Node is running securely.' 
    });
});

// Mount API Routes
app.use('/api', apiRoutes); // Activated routes

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[Worker System Error]: ${err.message}`);
    res.status(500).json({ 
        success: false, 
        error: err.message || 'Internal Server Error in Worker Node' 
    });
});

// Start the core engine
app.listen(port, () => {
    console.log(`[Vidoose Engine] Worker started successfully on port ${port} in ${nodeEnv} mode.`);
});