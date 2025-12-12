import { prisma } from "@/infra/db/prismaClient";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/interfaces/tasks/task.interface";

export class TaskRepository {
  async createTask(data: CreateTaskRequest, userId: string) {
    return prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateTask(id: string, data: UpdateTaskRequest) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async UpsertTask(id: string, data: UpdateTaskRequest, userId: string) {
    return prisma.task.upsert({
      where: { id },
      update: data,
      create: {
        ...data,
        userId,
        title: data.title || "",
        description: data.description || "",
        completed: data.completed ?? false,
      },
    });
  }

  async findAllTasks(userId: string) {
    return prisma.task.findMany({
      where: { userId },
    });
  }

  async findTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  async deleteTask(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}
