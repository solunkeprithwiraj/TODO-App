import { User, UserRole } from "@prisma/client";

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthRegisterPostRequest:
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
 *           description: The user's name of the user
 *           example: John Doe
 */

/**
 * @interface AuthRegisterPostRequest
 * @description The request for the registration
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 * @property {string} name - The user's name of the user
 */
export interface AuthRegisterPostRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthRegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: The success of the response
 *         message:
 *           type: string
 *           description: The message of the response
 *         data:
 *           type: object
 *           properties:
 *             $ref: "#/components/schemas/UserInterface"
 */

/**
 * @interface AuthRegisterResponse
 * @description The response for the registration
 * @property {boolean} success - The success of the response
 * @property {string} message - The message of the response
 * @property {UserInterface | undefined} data - The data of the response
 */
export interface AuthRegisterResponse {
  success: boolean;
  message: string;
  data?: UserInterface;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthLoginPostRequest:
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
 * @interface AuthLoginPostRequest
 * @description The data required to login a user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 */
export interface AuthLoginPostRequest {
  email: string;
  password: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UserInterface:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - name
 *         - role
 *         - accessToken
 *         - refreshToken
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the user
 *           example: "507f1f77bcf86cd799439011"
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           description: The user's name of the user
 *           example: "john_doe"
 *         role:
 *           type: string
 *           description: The role of the user
 *           example: "ADMIN"
 *         accessToken:
 *           type: string
 *           description: The access token of the user
 *           example: "1234567890"
 *         refreshToken:
 *           type: string
 *           description: The refresh token of the user
 *           example: "1234567890"
 *         createdAt:
 *           type: string
 *           description: The date and time the user was created
 *           example: "2021-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           description: The date and time the user was last updated
 *           example: "2021-01-01T00:00:00.000Z"
 */
/**
 * @interface UserInterface
 * @description The interface for the user
 * @property {string} id - The ID of the user
 * @property {string} email - The email of the user
 * @property {string} name - The user's name of the user
 * @property {UserRole} role - The role of the user
 * @property {string} accessToken - The access token of the user
 * @property {string} refreshToken - The refresh token of the user
 * @property {Date} createdAt - The date and time the user was created
 * @property {Date} updatedAt - The date and time the user was last updated
 */
export interface UserInterface {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: The success of the response
 *         message:
 *           type: string
 *           description: The message of the response
 *         data:
 *           type: object
 *           properties:
 *             $ref: "#/components/schemas/UserInterface"
 */

/**
 * @interface AuthLoginResponse
 * @description The response for the login
 * @property {boolean} success - The success of the response
 * @property {string} message - The message of the response
 * @property {UserInterface | undefined} data - The data of the response
 */
export interface AuthLoginResponse {
  success: boolean;
  message: string;
  data?: UserInterface;
}
/**
 * @openapi
 * components:
 *   schemas:
 *     AuthLogoutPostRequest:
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
 * @interface AuthLogoutPostRequest
 * @description The request for the logout
 * @property {string} userId - The ID of the user
 */
export interface AuthLogoutPostRequest {
  userId: string;
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

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthRefreshTokenPostRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token of the user
 *           example: "1234567890"
 */
/**
 * @interface AuthRefreshTokenPostRequest
 * @description The request for the refresh token
 * @property {string} refreshToken - The refresh token of the user
 */
export interface AuthRefreshTokenPostRequest {
  refreshToken: string;
}
