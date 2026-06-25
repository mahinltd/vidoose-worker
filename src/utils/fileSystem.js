// ©2026 Vidoose Mahin Ltd develop by (Tanvir)

const fs = require('fs');

const cleanupTempFiles = (filePaths) => {
    filePaths.forEach((filePath) => {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`[Cleanup Error] Failed to delete file: ${filePath}`);
                } else {
                    console.log(`[Cleanup Success] Wiped ephemeral file: ${filePath}`);
                }
            });
        }
    });
};

module.exports = {
    cleanupTempFiles
};