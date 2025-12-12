export class WorkItemQueryBuilder {
  private query: any = {};

  byProject(projectId: string) {
    this.query.projectId = projectId;
    return this;
  }

  byStatus(status: string[]) {
    this.query.status = { in: status };
    return this;
  }

  build() {
    return this.query;
  }
}
