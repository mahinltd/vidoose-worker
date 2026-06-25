// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

const { workerApiKey } = require('../config/env');

const authenticateGateway = (req, res, next) => {
    const clientApiKey = req.headers['x-api-key'];

    if (!clientApiKey || clientApiKey !== workerApiKey) {
        console.warn(`[Security Alert] Unauthorized access attempt from IP: ${req.ip}`);
        return res.status(403).json({
            success: false,
            error: 'Forbidden: Invalid or missing API Key'
        });
    }

    next();
};

module.exports = authenticateGateway;