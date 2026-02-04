import express, { Router } from "express";
import { body } from "express-validator";
import { loginForm, getCsrfToken } from "../controllers/userController";
import { verifyCsrfToken } from "../middleware/csrfMiddleware";

const userRouter: Router = express.Router();

// Validation rules for login
const loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Proporciona un correo electrónico válido")
    .notEmpty()
    .withMessage("El correo es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

userRouter.get("/csrf-token", getCsrfToken);

// 1. CSRF Verification -> 2. Validation -> 3. Controller
userRouter.post("/login", verifyCsrfToken, loginValidators, loginForm);

export default userRouter;
