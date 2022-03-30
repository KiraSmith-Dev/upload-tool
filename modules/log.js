const originalConsole = console;
const { hexToRgb, color, hex } = require('./color');

function baseLog(prefix, prefixColorHex, ...message) {
    originalConsole.log(hex('#ffffff')('[') + hex(prefixColorHex)(prefix) + hex('#ffffff')('] ') + hex('#abfffc')(message.join(' ')) + hex('#ffffff')());
}

function log(...message) {
    baseLog('+', '#12de4c', message)
}

function warn(...message) {
    baseLog('#', '#c79b16', message)
}

function error(...message) {
    baseLog('-', '#cc2d18', message)
}

module.exports = { info: log, log, warn, error };
