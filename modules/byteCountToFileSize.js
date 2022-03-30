const suffixes = ['', 'K', 'M', 'G', 'T'].map(suffix => ` ${suffix}B`);
function byteCountToFileSize(count) {
    // Figure out how many powers of 1024 we're at, Math.abs for support of negative file sizes (ex: file size deltas)
    let index = count == 0 ? 0 : Math.floor(Math.log(Math.abs(count)) / Math.log(1024));
    
    // Make sure index is in bounds
    if (index >= suffixes.length)
        index = suffixes.length - 1;
    
    // Figure out how many of this power of 1024 we at
    const adjustedSize = (count / Math.pow(1024, index)) // Decimal representation of this unit...
        .toFixed(index > 0 ? 2 : 0); // Bytes can be fixed to 0 decimals, since they're the smallest unit, otherwise fix to 2
    
    // Suffix already includes a space, so we can easily (and performantly! /j) concatenate
    return adjustedSize + suffixes[index];
}

module.exports = byteCountToFileSize;