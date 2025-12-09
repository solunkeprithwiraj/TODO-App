import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../../utils/response.util";
import {
  AuthTokenPayload,
  AuthRegisterPostRequest,
  AuthLoginPostRequest,
} from "../../interfaces/auth.interface";
import { logger } from "../../utils/logger";

export class AuthService {
  private prisma = new PrismaClient({});

  private JWT_SECRET: string =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";

  async register(data: AuthRegisterPostRequest) {
    const { email, password, name } = data;
    logger.info("Registering user", data);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return errorResponse("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const accessToken = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
      expiresIn: "7d",
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        accessToken: accessToken as string | null,
        refreshToken: refreshToken as string | null,
        accessTokenExpiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return successResponse("register successful", userWithoutPassword);
  }

  async login(data: AuthLoginPostRequest) {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return errorResponse("user does not exist");
    }

    if (!user.password) {
      return errorResponse("password is not set");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse("invalid password");
    }

    const accessToken = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
      expiresIn: "7d",
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        accessToken: accessToken as string | null,
        refreshToken: refreshToken as string | null,
        accessTokenExpiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password: _password, ...userWithoutPassword } = user;

    return successResponse("login successful", userWithoutPassword);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: null,
        refreshToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
      },
    });

    return successResponse("Logout successful", null);
  }

  async refreshToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, this.JWT_SECRET);
    const userId = (decoded as AuthTokenPayload).userId;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return errorResponse("User not found");
    }
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      return errorResponse("Refresh token expired");
    }
    const accessToken = jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: "1h",
    });
    return successResponse("Refresh token successful", {
      accessToken,
      refreshToken,
    });
  }
}
