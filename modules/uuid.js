const { v4: _uuidv4 } = require('uuid');

module.exports = () => {
    return _uuidv4().replaceAll('-', '').slice(0, 16);
};
