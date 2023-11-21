const {createToken, createCookieWithToken, verifyToken} = require('./user.js');
const checkIfAllowed = require('./checkIfAllowed.js');

module.exports = {
    createToken,
    createCookieWithToken,
    verifyToken,
    checkIfAllowed
};