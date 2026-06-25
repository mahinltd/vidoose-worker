// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

const { spawn } = require('child_process');

const extractVideoMetadata = (url) => {
    return new Promise((resolve, reject) => {
        // Added Deno, Cookies, and Web Client bypass arguments
        const args = [
            '--cookies', '/home/ubuntu/vidoose-worker/cookies.txt',
            '--extractor-args', 'youtube:player_client=web',
            '--js-runtimes', 'deno',
            '-J', '--no-warnings', url
        ];

        const ytDlpProcess = spawn('yt-dlp', args);
        let outputData = '';
        let errorData = '';

        ytDlpProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        ytDlpProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        ytDlpProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`[yt-dlp Error]: ${errorData}`);
                return reject(new Error('Failed to extract metadata. Check video URL or IP status.'));
            }

            try {
                const metadata = JSON.parse(outputData);
                resolve({
                    id: metadata.id,
                    title: metadata.title,
                    thumbnail: metadata.thumbnail,
                    duration: metadata.duration,
                    formats: metadata.formats // We will filter these formats later in the Render backend
                });
            } catch (parseError) {
                console.error(`[JSON Parse Error]: ${parseError.message}`);
                reject(new Error('Failed to parse yt-dlp metadata.'));
            }
        });
    });
};

module.exports = {
    extractVideoMetadata
};