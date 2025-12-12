export class EventBus {
  private listeners = new Map<string, Function[]>();

  subscribe(eventName: string, handler: Function) {
    const existing = this.listeners.get(eventName) || [];
    existing.push(handler);
    this.listeners.set(eventName, existing);
  }

  async publish(eventName: string, payload: any) {
    const handlers = this.listeners.get(eventName) || [];
    for (const handler of handlers) {
      await handler(payload);
    }
  }
}
