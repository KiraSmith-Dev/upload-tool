(async () => {
    console = require('./modules/log');
    const useTryAsync = require("no-try").useTryAsync;
    const fs = require('fs').promises;
    const path = require('path');
    const UUID = require('./modules/uuid');
    const failout = require('./modules/failout');
    const compressUpload = require('./modules/compressUpload');
    const { port } = require('./config');
    const util = require('util');
    const copy = util.promisify(require('copy-paste').copy);
    const getIP = util.promisify(require('external-ip')());
    const byteCountToFileSize = require('./modules/byteCountToFileSize');
    
    const [statRes, pathToUpload, options] = await require('./modules/getOptions')();
    
    console.log(`Uploading: "${pathToUpload}"`);
    console.log(`Target filename: "${options.rename}"`);
    
    if (options.glob && options.glob !== '**/*')
        console.log(`Glob pattern: "${options.glob}"`);
    
    if (options.blacklist)
        console.log(`Blacklist pattern: "${options.blacklist}"`);
    
    const uuid = UUID();
    const parentDirectory = path.join(__dirname, 'public', uuid);
    const destinationPath = path.join(parentDirectory, options.rename);
    
    const [mkdirErr] = await useTryAsync(() => fs.mkdir(parentDirectory, { recursive: true }));
    if (mkdirErr && mkdirErr.code != 'EEXIST')
        failout(mkdirErr);
    
    
    const [ipErr, ip] = await useTryAsync(() => getIP());
    
    if (ipErr)
        failout('somehow failed to find your public ip. Are you offline?');
    
    const url = [`http://${ip}:${port}`, uuid, encodeURIComponent(options.rename)].join('/');
    
    await copy(url);
    console.log(`Coppied to clipboard: ${url}`);
    
    if (!options.zip) {
        const [copyErr] = await useTryAsync(() => fs.copyFile(pathToUpload, destinationPath));
        if (copyErr)
            failout(copyErr);
    } else
        await compressUpload(statRes, options, pathToUpload, destinationPath);
    
    
    const [statErr2, statRes2] = await useTryAsync(() => fs.stat(destinationPath));
    
    if (statErr2)
        if (statErr2.code == 'ENOENT')
            failout(`File or directory not found: ${program.args[0]}`);
        else
            failout(statErr2);
    
    console.log(`Uploaded: ${options.rename} (${byteCountToFileSize(statRes2.size)})`);
})();
