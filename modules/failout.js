module.exports = (message) => {
    console.error('error:', (message && message.message) ? message.message : message);
    process.exit(1);
};
