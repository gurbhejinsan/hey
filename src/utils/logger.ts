import chalk, { ChalkInstance } from "chalk";
import boxen from "boxen";
import { Template } from "../types";

/**
 * Logger utility for consistent CLI output formatting
 */
export class Logger {
  /**
   * Log success message with green color
   */
  static success(message: string): void {
    console.log(chalk.green(`✅ ${message}`));
  }

  /**
   * Log error message with red color
   */
  static error(message: string, ...optionalParams: any[]): void {
    console.log(chalk.red(`❌ ${message}`), optionalParams);
  }

  /**
   * Log warning message with yellow color
   */
  static warn(message: string): void {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  /**
   * Log info message with blue color
   */
  static info(message: string): void {
    console.log(chalk.blue(`ℹ️  ${message}`));
  }
  static running(message: string): void {
    console.log(chalk.gray(`ℹ️  ${message}`));
  }
  static bold(type: keyof ChalkInstance, message: string) {
    const colorFn = (chalk as any)[type].bold;
    if (typeof colorFn === "function") {
      console.log(colorFn(`${message}`));
    } else {
      console.log(message);
    }
  }

  /**
   * Log a boxed message for emphasis
   */
  static box(message: string, title?: string): void {
    console.log(
      boxen(message, {
        title,
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      }),
    );
  }

  /**
   * Log plain message without formatting
   */
  static log(message: string): void {
    console.log(message);
  }

  /**
   * Create a divider line
   */
  static divider(): void {
    console.log(chalk.gray("─".repeat(50)));
  }

  /**
   * Display success message with boxen
   */
  static successBox(title: string, message: string): void {
    console.log(
      boxen(`${chalk.green.bold(title)}\n\n${message}`, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
      }),
    );
  }
  /**
   * Display Error message with boxen
   */
  static errorBox(title: string, message: string): void {
    console.log(
      boxen(`${chalk.red.bold(title)}\n\n${message}`, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "red",
      }),
    );
  }

  static displayTemplateInfo(template: Template, targetPath: string): void {
    console.log(chalk.blue(`Adding template: ${chalk.bold(template.title)}`));
    console.log(chalk.gray(`Type: ${template.type}`));
    console.log(chalk.gray(`Description: ${template.description}`));
    console.log(chalk.gray(`Target: ${targetPath}`));

    if (template.dependencies && template.dependencies.length > 0) {
      console.log(
        chalk.gray(`Dependencies: ${template.dependencies.join(", ")}`),
      );
    }
    console.log("");
  }
}
