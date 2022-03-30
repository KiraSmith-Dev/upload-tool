function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function color(r, g, b) {
    return x => `\x1b[38;2;${r};${g};${b}m` + (x ? x : '');
}

function hex(hex) {
    return color(...Object.values(hexToRgb(hex)))
}

module.exports = { hexToRgb, color, hex };
