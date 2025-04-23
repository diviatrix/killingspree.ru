// 1337plus.js
const createServer = require('./server/expressServer');

const PORT = 3000;
const app = createServer();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
33