"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginForm = void 0;
var loginForm = function (res, req) {
    console.log(req.body);
    return res.json({ "mssg": "Hola mundo" });
};
exports.loginForm = loginForm;
