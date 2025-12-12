import { prisma } from "@/infra/db/prismaClient";

import { WorkItemStatus, WorkItemType } from "@prisma/client";

export class WorkItemRepository {
  async findById(id: string) {
    return prisma.workItem.findUnique({
      where: { id },
    });
  }

  async findByTitle(projectId: string, title: string) {
    return prisma.workItem.findFirst({
      where: { projectId, title },
    });
  }

  async create(projectId: string, title: string, userId: string) {
    return prisma.workItem.create({
      data: {
        projectId,
        title,
        type: WorkItemType.FEATURE,
        status: WorkItemStatus.IN_PROGRESS,
        autoCreated: true,
        createdById: userId,
      },
    });
  }
}
