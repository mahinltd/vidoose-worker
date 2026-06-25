// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

const ffmpeg = require('fluent-ffmpeg');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { cleanupTempFiles } = require('../utils/fileSystem');

const downloadStream = (url, formatId, outputPath) => {
    return new Promise((resolve, reject) => {
        // Added bypass arguments for downloading streams
        const args = [
            '--cookies', '/home/ubuntu/vidoose-worker/cookies.txt',
            '--extractor-args', 'youtube:player_client=web',
            '--js-runtimes', 'deno',
            '-f', formatId, 
            '-o', outputPath, 
            url
        ];

        const ytDlp = spawn('yt-dlp', args);
        
        ytDlp.on('close', (code) => {
            if (code === 0) resolve(outputPath);
            else reject(new Error(`Failed to download format: ${formatId}`));
        });
    });
};

const processAndStreamMedia = async (url, videoFormat, audioFormat, res) => {
    const timestamp = Date.now();
    // Resolving absolute paths for the tmp directory
    const videoPath = path.join(__dirname, '../../tmp', `video_${timestamp}.mp4`);
    const audioPath = path.join(__dirname, '../../tmp', `audio_${timestamp}.m4a`);
    const finalPath = path.join(__dirname, '../../tmp', `final_${timestamp}.mp4`);

    try {
        console.log(`[Core Engine] Downloading streams to ephemeral /tmp cache...`);
        
        // Execute downloads concurrently for maximum speed
        await Promise.all([
            downloadStream(url, videoFormat, videoPath),
            downloadStream(url, audioFormat, audioPath)
        ]);

        console.log(`[Core Engine] Merging streams using FFmpeg...`);
        
        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions([
                '-c:v copy', // Copy video codec (extremely fast, no re-encoding)
                '-c:a aac',  // Convert audio to AAC for wide compatibility
                '-strict experimental'
            ])
            .save(finalPath)
            .on('end', () => {
                console.log(`[Core Engine] Merge complete. Piping stream to client...`);
                
                // Set headers for direct browser download
                res.setHeader('Content-Type', 'video/mp4');
                res.setHeader('Content-Disposition', `attachment; filename="vidoose_HQ_${timestamp}.mp4"`);

                // Create readable stream and pipe to user's writable response
                const readStream = fs.createReadStream(finalPath);
                readStream.pipe(res);

                // Wipe out all temporary files immediately after the stream ends
                readStream.on('close', () => {
                    console.log(`[Core Engine] Stream finished. Initiating cleanup...`);
                    cleanupTempFiles([videoPath, audioPath, finalPath]);
                });
            })
            .on('error', (err) => {
                console.error(`[FFmpeg Error]: ${err.message}`);
                cleanupTempFiles([videoPath, audioPath, finalPath]);
                if (!res.headersSent) {
                    res.status(500).json({ success: false, error: 'Failed to merge media files' });
                }
            });

    } catch (error) {
        console.error(`[Process Error]: ${error.message}`);
        cleanupTempFiles([videoPath, audioPath, finalPath]);
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: 'Failed to download source streams from social platform' });
        }
    }
};

module.exports = {
    processAndStreamMedia
};