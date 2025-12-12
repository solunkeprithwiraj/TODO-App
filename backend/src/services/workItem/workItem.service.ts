import { WorkItemRepository } from "@/domain/workItem/workItemRepository";
import { EventBus } from "@/infra/events/EventBus";

export class WorkItemService {
  constructor(private repo: WorkItemRepository, private events: EventBus) {}

  async createFromBranch(projectId: string, branch: string) {
    const title = this.formatTitle(branch);

    const existing = await this.repo.findByTitle(projectId, title);

    if (existing) {
      return existing;
    }

    const workItem = await this.repo.create(projectId, title);

    this.events.publish("workItem.created", { workItem });
    return workItem;
  }

  private formatTitle(branch: string) {
    const raw = branch.replace(/refs\/heads\//, "").replace(/\//g, " ");
    return raw.replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
