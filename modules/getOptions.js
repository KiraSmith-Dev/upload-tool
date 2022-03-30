module.exports = async () => {
    const { program, InvalidArgumentError } = require('commander');
    const useTryAsync = require("no-try").useTryAsync;
    const path = require('path');
    const fs = require('fs').promises;
    const failout = require('./failout');
    const sanitizeFilename = require('sanitize-filename');
    
    function commanderParseInt(value, dummyPrevious) {
        const parsedValue = parseInt(value, 10);
        
        if (isNaN(parsedValue)) 
            throw new InvalidArgumentError('Not a number.');
        
        if (parsedValue < 0 || parsedValue > 9)
            throw new InvalidArgumentError('Outside of range: must be 0-9, 0 = none, 1 = low, 9 = high.');
        
        return parsedValue;
    }
    
    program
        .argument('<path>', 'Path to file/directory to upload')
        .option('-r --rename <name>', 'Output filename')
        .option('-g --glob <pattern>', 'Include files matching this pattern', '**/*')
        .option('-b --blacklist <pattern>', 'Exclude files matching this pattern')
        .option('-l --level <level>', 'Compression level 0-9, 0 = none, 1 = low, 9 = high', commanderParseInt, 9)
        .option('-z --zip', 'Compress file to archive');
    
    program.parse();
    const options = program.opts();
    
    if (options.glob == '**/*' && !options.blacklist)
        options.glob = undefined;
    
    const pathToUpload = path.join(process.cwd(), program.args[0]);
    
    const [statErr, statRes] = await useTryAsync(() => fs.stat(pathToUpload));
    
    if (statErr)
        if (statErr.code == 'ENOENT')
            failout(`File or directory not found: ${program.args[0]}`);
        else
            failout(statErr);
    
    if (statRes.isDirectory())
        options.zip = true;
    else
        ['glob', 'blacklist'].forEach(option => options[option] ? failout(`can't use ${option} if path isn't a directory`) : null); 
    
    // Decide filename
    if (!options.rename) {
        const fslashIndex = program.args[0].lastIndexOf('/');
        const bslashIndex = program.args[0].lastIndexOf('\\');
        if (fslashIndex != -1 && bslashIndex != -1)
            failout(`don't use mixed slashes in file path: ${program.args[0]}`);
        
        const farthestSeperator = (fslashIndex > bslashIndex) ? fslashIndex : bslashIndex;
        options.rename = farthestSeperator == -1 ? program.args[0] : program.args[0].slice(farthestSeperator + 1);
        if (statRes.isFile() && options.zip) {
            const lastIndexOfDot = options.rename.lastIndexOf('.');
            if (lastIndexOfDot != -1)
                options.rename = options.rename.slice(0, lastIndexOfDot);
        }
    }
    
    if (!options.rename.endsWith('.zip') && options.zip)
        options.rename += '.zip';
    
    const sanatizedRename = sanitizeFilename(options.rename);
    if (sanatizedRename !== options.rename)
        failout(`invalid filename: "${options.rename}". Maybe try: "${sanatizedRename}"`);
    
    return [statRes, pathToUpload, options];
};
