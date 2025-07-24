import { ChalkInstance } from "chalk";
import { Template } from "../types";
/**
 * Logger utility for consistent CLI output formatting
 */
export declare class Logger {
    /**
     * Log success message with green color
     */
    static success(message: string): void;
    /**
     * Log error message with red color
     */
    static error(message: string, ...optionalParams: any[]): void;
    /**
     * Log warning message with yellow color
     */
    static warn(message: string): void;
    /**
     * Log info message with blue color
     */
    static info(message: string): void;
    static running(message: string): void;
    static bold(type: keyof ChalkInstance, message: string): void;
    /**
     * Log a boxed message for emphasis
     */
    static box(message: string, title?: string): void;
    /**
     * Log plain message without formatting
     */
    static log(message: string): void;
    /**
     * Create a divider line
     */
    static divider(): void;
    /**
     * Display success message with boxen
     */
    static successBox(title: string, message: string): void;
    /**
     * Display Error message with boxen
     */
    static errorBox(title: string, message: string): void;
    static displayTemplateInfo(template: Template, targetPath: string): void;
}
//# sourceMappingURL=logger.d.ts.map