"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = require("express");
var userController_1 = require("../controllers/userController");
var userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get('/');
userRouter.post('/login', userController_1.loginForm);
