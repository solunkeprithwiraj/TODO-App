type Factory = () => any;

import { AuthRepository } from "./domain/auth/AuthRepository";
import { TaskRepository } from "./domain/tasks/task.repository";
import { AuthService } from "./services/auth/auth.service";
import { TaskService } from "./services/tasks/task.service";

class Container {
  private singletons = new Map<string, any>();
  private factories = new Map<string, Factory>();

  registerSingleton(name: string, factory: Factory) {
    this.factories.set(name, factory);
  }

  resolve<T>(name: string): T {
    if (!this.singletons.has(name)) {
      const factory = this.factories.get(name);
      if (!factory) {
        throw new Error(`Singleton ${name} not found`);
      }
      this.singletons.set(name, factory());
    }
    return this.singletons.get(name);
  }
}

export const container = new Container();

// Register app singletons
container.registerSingleton("AuthService", () => {
  const repo = new AuthRepository();
  return new AuthService(repo);
});

container.registerSingleton("TaskService", () => {
  const repo = new TaskRepository();
  return new TaskService(repo);
});
