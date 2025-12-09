import { Router } from "express";
import AuthController from "../controller/auth/auth.controller";
import {
  validateLogin,
  validateLogout,
  validateRefreshToken,
  validateRegister,
} from "../validators/auth.validator";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Registers a new user with the given email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterPostRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 $ref: '#/components/schemas/AuthRegisterResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.post("/register", validateRegister, authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     description: Logs in a user with their email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginPostRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 $ref: '#/components/schemas/AuthLoginResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.post("/login", validateLogin, authController.login);

/**
 * @openapi
 * /auth/logout:
 *   security:
 *     - bearerAuth: []
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout a user
 *     description: Logs out a user by invalidating their token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               $ref: '#/components/schemas/AuthLogoutPostRequest'
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message when userId is not provided
 */
router.post("/logout", validateLogout, authenticate, authController.logout);

/**
 * @openapi
 * /auth/refresh-token:
 *   security:
 *     - bearerAuth: []
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh a token
 *     description: Refreshes a token by generating a new one
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               $ref: '#/components/schemas/AuthRefreshTokenPostRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message when refreshToken is not provided
 *                   required:
 *                     - refreshToken
 */
router.post(
  "/refresh-token",
  validateRefreshToken,
  authenticate,
  authController.refreshToken
);

export default router;
