(async () => {
    const express = require('express');
    const app = express();
    const path = require('path');
    const { port } = require('./config');
    const useTryAsync = require("no-try").useTryAsync;
    const fs = require('fs').promises;
    const publicDir = path.join(__dirname, 'public');

    const [mkdirErr] = await useTryAsync(() => fs.mkdir(publicDir, { recursive: true }));
    if (mkdirErr && mkdirErr.code != 'EEXIST') {
        console.error(mkdirErr);
        process.exit(1);
    }

    app.use('/', express.static(publicDir));

    app.listen(port, () => {
        console.log(`File server listening at http://localhost:${port}`);
    });
})();
