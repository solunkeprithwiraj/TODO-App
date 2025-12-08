import { AuthService } from "../../services/auth/auth.service";
import { Request, Response } from "express";
import { logger } from "../../utils/logger";

class AuthController {
  private readonly authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const result = await this.authService.register({ email, password, name });
    return res.status(result.success ? 200 : 400).json(result);
  };

  login = async (req: Request, res: Response) => {
    logger.info("Login request received", req.body);
    const { email, password } = req.body;
    const result = await this.authService.login({ email, password });
    return res.status(result.success ? 200 : 400).json(result);
  };

  logout = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const result = await this.authService.logout(userId);
    return res.status(result.success ? 200 : 400).json(result);
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    return res.status(result.success ? 200 : 400).json(result);
  };
}

export default AuthController;
