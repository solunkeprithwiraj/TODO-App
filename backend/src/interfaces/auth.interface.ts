/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterData:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *           minLength: 6
 *           example: password123
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: John Doe
 */

import { User } from "@prisma/client";

/**
 * @interface RegisterData
 * @description The data required to register a user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 * @property {string} name - The name of the user
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginData:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user
 *           example: password123
 */
/**
 * @interface LoginData
 * @description The data required to login a user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthTokenPayload:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *           example: "507f1f77bcf86cd799439011"
 */
/**
 * @interface AuthTokenPayload
 * @description The payload of the authentication token
 * @property {string} userId - The ID of the user
 */
export interface AuthTokenPayload {
  userId: string;
}

export interface AuthLoginResponse {
  user: User;
  token: string;
}
