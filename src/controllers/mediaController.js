// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

const ytdlpService = require('../services/ytdlpService');
const ffmpegService = require('../services/ffmpegService');

const extractMetadata = async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Video URL is required'
            });
        }

        console.log(`[Processing] Extracting metadata for: ${url}`);
        const metadata = await ytdlpService.extractVideoMetadata(url);

        res.status(200).json({
            success: true,
            message: 'Metadata extracted successfully',
            data: metadata
        });
    } catch (error) {
        next(error);
    }
};

const processAndStream = async (req, res, next) => {
    try {
        const { url, videoFormat, audioFormat } = req.body;

        if (!url || !videoFormat || !audioFormat) {
            return res.status(400).json({
                success: false,
                error: 'URL, videoFormat, and audioFormat ID are required'
            });
        }

        console.log(`[Processing] Initializing stream pipeline for: ${url}`);
        
        // Pass control to the FFmpeg service for downloading, merging, and streaming
        ffmpegService.processAndStreamMedia(url, videoFormat, audioFormat, res);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    extractMetadata,
    processAndStream
};