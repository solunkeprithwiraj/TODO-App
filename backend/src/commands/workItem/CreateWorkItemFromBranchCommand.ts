export class CreateWorkItemFromBranchCommand {
  constructor(
    public readonly projectId: string,
    public readonly branch: string
  ) {}
}
