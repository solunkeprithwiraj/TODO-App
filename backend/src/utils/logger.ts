import chalk from "chalk";

const timestamp = () => {
  return chalk.gray(
    `[${new Date().toLocaleTimeString("en-IN", { hour12: false })}]`
  );
};

export const logger = {
  info(message: string, data?: any): void {
    console.log(timestamp(), chalk.blue(message), data);
  },
  error(message: string, data?: any): void {
    console.error(timestamp(), chalk.red(message), data);
  },
  success(message: string, data?: any): void {
    console.log(timestamp(), chalk.green(message), data);
  },
  warn(message: string, data?: any): void {
    console.warn(timestamp(), chalk.yellow(message), data);
  },
  debug(message: string, data?: any): void {
    console.log(timestamp(), chalk.magenta(message), data);
  },
  server(message: string, data?: any): void {
    console.log(timestamp(), chalk.cyan(message), data);
  },
  banner(message: string): void {
    console.log(timestamp(), chalk.cyan(message));
  },
};
