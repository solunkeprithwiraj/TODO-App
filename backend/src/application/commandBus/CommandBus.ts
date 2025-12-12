export class CommandBus {
  private handlers = new Map<string, any>();

  register(commandName: string, handler: any) {
    this.handlers.set(commandName, handler);
  }

  async execute(command: any) {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) throw new Error("No handler registered");
    return handler.handle(command);
  }
}
