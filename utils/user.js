const jwt = require('jsonwebtoken');

const createToken = (user) => {
    return jwt.sign(
        {userID: user._id, name: user.name, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    );
}

const createCookieWithToken = (res, token) => {
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    createToken,
    createCookieWithToken,
    verifyToken
};