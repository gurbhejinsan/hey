import type { ProjectConfig, Template, TemplateRegistry } from "../types.js";
/**
 * Utility functions for file operations and CLI helpers
 */
export declare const CONFIG_FILE = "myproject.config.json";
export declare const REGISTRY_FILE = ".mycli.registry.json";
/**
 * Check if the current directory is initialized as a mycli project
 */
export declare function isProjectInitialized(): Promise<boolean>;
/**
 * Create project directories based on configuration
 */
export declare function createProjectDirectories(config: ProjectConfig): Promise<void>;
export declare class ConfigFiles {
    /**
     * Read the project configuration file
     */
    static readProjectConfig(): Promise<ProjectConfig | null>;
    /**
     * Read the template registry file
     */
    static readTemplateRegistry(): Promise<TemplateRegistry | null>;
    /**
     * Write the project configuration file
     */
    static writeProjectConfig(config: ProjectConfig): Promise<void>;
    /**
     * Write the template registry file
     */
    static writeTemplateRegistry(registry: TemplateRegistry): Promise<void>;
}
export declare class Templates {
    /**
     * Find a template by name in the registry
     */
    static findTemplate(registry: TemplateRegistry, templateName: string): Template | null;
    /**
     * Replace placeholders in template content
     */
    static replacePlaceholders(content: string, replacements: Record<string, string>): string;
    /**
     * Get the appropriate file extension based on template type
     */
    /**
     * Convert template name to proper component name (PascalCase)
     */
    static toComponentName(name: string): string;
    /**
     * Convert template name to proper hook name (camelCase with 'use' prefix)
     */
    static toHookName(name: string): string;
}
/**
 * Run Prettier on the entire project
 */
export declare function runPrettier(): Promise<void>;
//# sourceMappingURL=index.d.ts.map