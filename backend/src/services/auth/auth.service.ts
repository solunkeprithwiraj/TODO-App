import bcrypt from "bcryptjs";
import { AuthRepository } from "@/domain/auth/AuthRepository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/token.util";
import { successResponse, errorResponse } from "../../utils/response.util";
import {
  AuthLoginPostRequest,
  AuthRefreshTokenPostRequest,
  AuthRegisterPostRequest,
} from "@/interfaces/auth.interface";

export class AuthService {
  constructor(private repo: AuthRepository) {}

  async register(data: AuthRegisterPostRequest) {
    const { email, password, name } = data;

    const existing = await this.repo.findByEmail(email);
    if (existing) {
      return errorResponse("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.repo.createUser({
      email,
      password: hashedPassword,
      name,
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await this.repo.updateTokens(user.id, {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + 1 * 3600 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    delete (user as any).password;
    const userData = {
      ...user,
      accessToken,
      refreshToken,
    };
    return successResponse("User registered successfully", userData);
  }

  async login(data: AuthLoginPostRequest) {
    const { email, password } = data;
    const user = await this.repo.findByEmail(email);
    if (!user) return errorResponse("User not found");

    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) return errorResponse("Invalid password");

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await this.repo.updateTokens(user.id, {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + 1 * 3600 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    delete (user as any).password;
    const userData = {
      ...user,
      accessToken,
      refreshToken,
    };

    return successResponse("Login successful", userData);
  }

  async logout(userId: string) {
    await this.repo.clearTokens(userId);
    return successResponse("Logout successful", null);
  }

  async refreshToken(data: AuthRefreshTokenPostRequest) {
    const { refreshToken } = data;
    let decoded: any;

    try {
      decoded = verifyToken(refreshToken);
    } catch {
      return errorResponse("Invalid token");
    }

    const user = await this.repo.findById(decoded.userId);
    if (!user) return errorResponse("User not found");

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await this.repo.updateTokens(user.id, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresAt: new Date(Date.now() + 1 * 3600 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    return successResponse("Token refreshed successfully", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }

  async profile(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) return errorResponse("User not found");

    delete (user as any).password;

    return successResponse("Profile retrieved successfully", user);
  }
}
