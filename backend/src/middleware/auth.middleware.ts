import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { errorResponse } from "../utils/response.util";
import { AuthTokenPayload } from "../interfaces/auth.interface";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();
const JWT_SECRET: string =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Middleware to authenticate requests using JWT access token
 * Extracts token from Authorization header and verifies it
 * Attaches userId to the request object if token is valid
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Request for", req.url);
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json(errorResponse("Authorization header is missing"));
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(errorResponse("Authorization header must start with 'Bearer '"));
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    if (!token || token.trim().length === 0) {
      return res.status(401).json(errorResponse("Token is missing"));
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;

    // Load user and attach to request
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json(errorResponse("User not found"));
    }

    const { password: _password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(errorResponse("Token has expired"));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(errorResponse("Invalid token"));
    }

    return res.status(401).json(errorResponse("Authentication failed"));
  }
};

/**
 * Optional middleware to extract userId from token without requiring authentication
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      if (token && token.trim().length > 0) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
          });

          if (user) {
            const { password: _password, ...userWithoutPassword } = user;
            req.user = userWithoutPassword;
          }
        } catch {
          // Ignore errors for optional authentication
        }
      }
    }

    next();
  } catch {
    // Continue without authentication if optional
    next();
  }
};
