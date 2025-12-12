import { CreateWorkItemFromBranchCommand } from "@/commands/workItem/CreateWorkItemFromBranchCommand";
import { WorkItemService } from "@/services/workItem/workItem.service";

export class CreateWorkItemFromBranchHandler {
  constructor(private service: WorkItemService) {}

  async handle(command: CreateWorkItemFromBranchCommand) {
    return this.service.createFromBranch(command.projectId, command.branch);
  }
}
