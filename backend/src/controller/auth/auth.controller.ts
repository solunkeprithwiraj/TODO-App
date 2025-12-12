import { AuthService } from "../../services/auth/auth.service";
import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { container } from "@/container";

class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = container.resolve<AuthService>("AuthService");
  }

  register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  };

  login = async (req: Request, res: Response) => {
    logger.info("Login request received", req.body);
    const result = await this.authService.login(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  };

  logout = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }
    const result = await this.authService.logout(userId);
    return res.status(result.success ? 200 : 400).json(result);
  };

  refreshToken = async (req: Request, res: Response) => {
    const result = await this.authService.refreshToken(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  };

  getUserProfile = async (req: Request, res: Response) => {
    // userId is set by authenticate middleware from JWT token
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }
    const result = await this.authService.profile(userId);
    return res.status(result.success ? 200 : 400).json(result);
  };
}

export default AuthController;
