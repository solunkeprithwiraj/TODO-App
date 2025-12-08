import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { errorResponse } from "../utils/response.util";

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const logoutSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/**
 * Middleware to validate register request body
 */
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(400).json(errorResponse(errorMessages));
    }
    return res.status(400).json(errorResponse("Invalid request data"));
  }
};

/**
 * Middleware to validate login request body
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(400).json(errorResponse(errorMessages));
    }
    return res.status(400).json(errorResponse("Invalid request data"));
  }
};

/**
 * Middleware to validate logout request body
 */
export const validateLogout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logoutSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(400).json(errorResponse(errorMessages));
    }
    return res.status(400).json(errorResponse("Invalid request data"));
  }
};

/**
 * Middleware to validate refresh token request body
 */
export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    refreshTokenSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(400).json(errorResponse(errorMessages));
    }
    return res.status(400).json(errorResponse("Invalid request data"));
  }
};
