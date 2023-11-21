const CustomError = require('../errors');

const checkIfAllowed = (requestUser, findID) => {
    if (requestUser.role === 'admin') {
        return;
    }
    if (requestUser.userID === findID.toString()) {
        return;
    } 
    throw new CustomError.ForbiddenError('Action Forbidden because of Role/FindID');
}

module.exports = checkIfAllowed;