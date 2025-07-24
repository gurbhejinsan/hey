import chalk from "chalk";
import boxen from "boxen";
/**
 * Logger utility for consistent CLI output formatting
 */
export class Logger {
    /**
     * Log success message with green color
     */
    static success(message) {
        console.log(chalk.green(`✅ ${message}`));
    }
    /**
     * Log error message with red color
     */
    static error(message, ...optionalParams) {
        console.log(chalk.red(`❌ ${message}`), optionalParams);
    }
    /**
     * Log warning message with yellow color
     */
    static warn(message) {
        console.log(chalk.yellow(`⚠️  ${message}`));
    }
    /**
     * Log info message with blue color
     */
    static info(message) {
        console.log(chalk.blue(`ℹ️  ${message}`));
    }
    static running(message) {
        console.log(chalk.gray(`ℹ️  ${message}`));
    }
    static bold(type, message) {
        const colorFn = chalk[type].bold;
        if (typeof colorFn === "function") {
            console.log(colorFn(`${message}`));
        }
        else {
            console.log(message);
        }
    }
    /**
     * Log a boxed message for emphasis
     */
    static box(message, title) {
        console.log(boxen(message, {
            title,
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "cyan",
        }));
    }
    /**
     * Log plain message without formatting
     */
    static log(message) {
        console.log(message);
    }
    /**
     * Create a divider line
     */
    static divider() {
        console.log(chalk.gray("─".repeat(50)));
    }
    /**
     * Display success message with boxen
     */
    static successBox(title, message) {
        console.log(boxen(`${chalk.green.bold(title)}\n\n${message}`, {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
        }));
    }
    /**
     * Display Error message with boxen
     */
    static errorBox(title, message) {
        console.log(boxen(`${chalk.red.bold(title)}\n\n${message}`, {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "red",
        }));
    }
    static displayTemplateInfo(template, targetPath) {
        console.log(chalk.blue(`Adding template: ${chalk.bold(template.title)}`));
        console.log(chalk.gray(`Type: ${template.type}`));
        console.log(chalk.gray(`Description: ${template.description}`));
        console.log(chalk.gray(`Target: ${targetPath}`));
        if (template.dependencies && template.dependencies.length > 0) {
            console.log(chalk.gray(`Dependencies: ${template.dependencies.join(", ")}`));
        }
        console.log("");
    }
}
//# sourceMappingURL=logger.js.map