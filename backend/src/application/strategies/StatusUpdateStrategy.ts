export interface StatusUpdateStrategy {
  supports(event: { type: string }): boolean;
  execute(event: any): Promise<void>;
}
