module.exports = async (statRes, options, pathToUpload, destinationPath) => {
    return new Promise(async (resolve, reject) => {
        const useTryAsync = require("no-try").useTryAsync;
        const fs = require('fs').promises;
        const failout = require('./failout');
        const archiver = require('archiver');
        const cliProgress = require('cli-progress');
        const { hexToRgb, color, hex } = require('./color');
        const getTotalSize = require('./getTotalSize');
        const byteCountToFileSize = require('./byteCountToFileSize');
        
        const [openErr, fileHandle] = await useTryAsync(() => fs.open(destinationPath, 'w'));
        if (openErr)
            failout(openErr);
        
        const output = fileHandle.createWriteStream();
        const archive = archiver('zip', {
            zlib: { level: options.level }
        });
        
        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn('ARCHIVE WARNING:');
                console.warn(err);
            } else
                throw err;
        });
        
        archive.on('error', (err) => {
            throw err;
        });
        
        /*
        -- types --
            eta
            duration
            percentage
            total
            value
        -----------
        */
        function formatValue(v, options, type) {
            if (['value', 'total'].includes(type))
                v = byteCountToFileSize(v);
            
            return v;
        }
        
        const bar = new cliProgress.SingleBar({ formatValue: formatValue, hideCursor: true, barGlue: hex('#68456e')(), format: `${hex('#ffffff')('[')}${hex('#12de4c')('+')}${hex('#ffffff')(']')} ${hex('#abfffc')()}Compressing: ${hex('#ffffff')()}[${hex('#ca85d4')()}{bar}${hex('#ffffff')()}] ${hex('#abfffc')()}{percentage}% | {value} / {total}${hex('#ffffff')()}` }, cliProgress.Presets.shades_classic);
        
        archive.on('progress', (data) => {
            bar.update(data.fs.processedBytes);
        });
        
        archive.on('finish', () => {
            bar.stop();
            resolve();
        });
        
        archive.pipe(output);
        
        // If single file, compress it as a single file instead of messing with glob
        if (statRes.isFile()) {
            bar.start(statRes.size, 0);
            archive.file(pathToUpload, { name: options.rename });
            archive.finalize();
            return;
        }
        
        [files, totalSize] = await getTotalSize(pathToUpload, options.glob, options.blacklist);
        
        bar.start(totalSize, 0);
        
        files.forEach(fileArgs => archive.file(...fileArgs));
        archive.finalize();
    });
};
