import { prisma } from "@/infra/db/prismaClient";

export class AuthRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: { email: string; name?: string; password: string }) {
    return prisma.user.create({
      data,
    });
  }

  async updateTokens(
    userId: string,
    token: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresAt: Date;
      refreshTokenExpiresAt: Date;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: token,
    });
  }

  async clearTokens(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: null,
        refreshToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
      },
    });
  }
}
