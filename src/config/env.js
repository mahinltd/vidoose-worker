// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

require('dotenv').config();

module.exports = {
    port: process.env.PORT || 4000,
    workerApiKey: process.env.WORKER_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development'
};