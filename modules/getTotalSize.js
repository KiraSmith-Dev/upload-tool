const glob = require('readdir-glob');

module.exports = (directory, pattern, blacklist) => {
    return new Promise(async (resolve, reject) => {
        const globber = glob(directory, { stat: true, dot: true, pattern: pattern, ignore: blacklist, silent: true, nocase: true });
        const files = [];
        let totalSize = 0;
        
        globber.on('error', err => {
            console.error(err);
        });
        
        globber.on('match', match => {
            totalSize += match.stat.size;
            
            const entryData = {
                name: match.relative,
                stats: match.stats
            };
            
            files.push([match.absolute, entryData]);
        });
        
        globber.on('end', () => {
            resolve([files, totalSize]);
        });
    });
};
