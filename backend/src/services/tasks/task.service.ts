import { TaskRepository } from "@/domain/tasks/task.repository";
import {
  CreateTaskRequest,
  DeleteTaskRequest,
  GetTaskByIdRequest,
  UpdateTaskRequest,
} from "@/interfaces/tasks/task.interface";
import { successResponse } from "@/utils/response.util";

export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  async createTask(data: CreateTaskRequest, userId: string) {
    const task = await this.taskRepo.createTask(data, userId);
    return successResponse("Task created successfully", task);
  }

  async updateTask(id: string, data: UpdateTaskRequest) {
    const task = await this.taskRepo.updateTask(id, data);
    return successResponse("Task updated successfully", task);
  }

  async deleteTask(data: DeleteTaskRequest) {
    const task = await this.taskRepo.deleteTask(data.id);
    return successResponse("Task deleted successfully", task);
  }

  async getTaskById(data: GetTaskByIdRequest) {
    const task = await this.taskRepo.findTaskById(data.id);
    return successResponse("Task found successfully", task);
  }

  async getAllTasks(userId: string) {
    const tasks = await this.taskRepo.findAllTasks(userId);
    return successResponse("Tasks found successfully", tasks);
  }
}
