"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfAllowed = exports.deleteImage = exports.verifyToken = exports.createCookieWithToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_fs_1 = __importDefault(require("node:fs"));
const errors_1 = __importDefault(require("../errors"));
const createToken = (user) => {
    const payload = {
        userID: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
exports.createToken = createToken;
const createCookieWithToken = (res, token) => {
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
};
exports.createCookieWithToken = createCookieWithToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
const deleteImage = (path) => __awaiter(void 0, void 0, void 0, function* () {
    yield node_fs_1.default.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
    });
});
exports.deleteImage = deleteImage;
const checkIfAllowed = (requestUser, findID) => {
    if (requestUser.role === 'admin') {
        return;
    }
    if (requestUser.userID === findID.toString()) {
        return;
    }
    throw new errors_1.default.ForbiddenError('Action Forbidden because of Role/FindID');
};
exports.checkIfAllowed = checkIfAllowed;
