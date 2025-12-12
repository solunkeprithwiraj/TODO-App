import { container } from "@/container";
import { TaskService } from "@/services/tasks/task.service";
import { Request, Response } from "express";

class TaskController {
  private taskService: TaskService;
  constructor() {
    this.taskService = container.resolve<TaskService>("TaskService");
  }

  createTask = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }
    const result = await this.taskService.createTask(req.body, userId);
    return res.status(result.success ? 200 : 400).json(result);
  };

  updateTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Task ID is required" });
    }
    const result = await this.taskService.updateTask(id, req.body);
    return res.status(result.success ? 200 : 400).json(result);
  };

  deleteTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Task ID is required" });
    }
    const result = await this.taskService.deleteTask({ id });
    return res.status(result.success ? 200 : 400).json(result);
  };

  getTaskById = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Task ID is required" });
    }
    const result = await this.taskService.getTaskById({ id });
    return res.status(result.success ? 200 : 400).json(result);
  };

  getAllTasks = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }

    const result = await this.taskService.getAllTasks(userId);
    return res.status(result.success ? 200 : 400).json(result);
  };
}
export default TaskController;
