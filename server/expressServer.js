const express = require('express');
const path = require('path');

function createServer() {
    const app = express();

    // Middleware for JSON parsing
    app.use(express.json());

    // Serve files from /public
    const publicPath = path.join(__dirname, '../public');
    app.use(express.static(publicPath));

    // Serve index.html for the root URL "/"
    app.get('/', (req, res) => {
        const indexPath = path.join(publicPath, 'index.html');
        res.sendFile(indexPath);
    });

    // Catch-all route for everything else
    app.get('*', (req, res) => {
        // Check if the requested file exists in the public folder
        const requestedFilePath = path.join(publicPath, req.path);

        // If the file doesn't exist, serve a 404 page
        res.sendFile(path.join(publicPath, '/pages/404.html'), (err) => {
            if (err) {
                console.error('Error serving 404 page:', err);
                res.status(404).send('404 - File Not Found');
            }
        });
    });

    return app;
}

module.exports = createServer;
