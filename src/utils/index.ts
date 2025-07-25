import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import type { ProjectConfig, Template, TemplateRegistry } from "../types.js";
import { Logger } from "./logger.js";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Utility functions for file operations and CLI helpers
 */

export const CONFIG_FILE = "myproject.config.json";
export const REGISTRY_FILE = "registry.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Check if the current directory is initialized as a mycli project
 */
export async function isProjectInitialized(): Promise<boolean> {
  try {
    const configExists = await fs.pathExists(CONFIG_FILE);
    // const registryExists = await fs.pathExists(REGISTRY_FILE);
    return configExists;
  } catch {
    return false;
  }
}

/**
 * Create project directories based on configuration
 */
export async function createProjectDirectories(
  config: ProjectConfig
): Promise<void> {
  const folders = Object.values(config.folders);

  for (const folder of folders) {
    try {
      await fs.ensureDir(folder);
      Logger.success(`Created directory: ${folder}`);

      const indexPath = `${folder}/index.ts`;

      const indexExists = await fs.pathExists(indexPath);
      if (!indexExists) {
        await fs.writeFile(indexPath, "export default {}\n", "utf8");
        Logger.success(`Created file: ${indexPath}`);
      } else {
        Logger.info(`File already exists: ${indexPath}`);
      }
    } catch (error) {
      Logger.error(`Failed to create directory or file in: ${folder}`, error);
      throw error;
    }
  }
}

export class ConfigFiles {
  /**
   * Read the project configuration file
   */
  static async readProjectConfig(): Promise<ProjectConfig | null> {
    try {
      if (!(await fs.pathExists(CONFIG_FILE))) {
        return null;
      }
      const config = await fs.readJson(CONFIG_FILE);
      return config as ProjectConfig;
    } catch (error) {
      console.error(chalk.red("Error reading project config:"), error);
      return null;
    }
  }

  /**
   * Read the template registry file
   */

  static async readTemplateRegistry(): Promise<TemplateRegistry | null> {
    try {
      const REGISTRY_FILE_PATH = path.resolve(
        __dirname,
        "../"+REGISTRY_FILE
      );
      console.log("🚀 ~ ConfigFiles ~ readTemplateRegistry ~ REGISTRY_FILE_PATH:", REGISTRY_FILE_PATH)
      if (!(await fs.pathExists(REGISTRY_FILE_PATH))) {
        return null;
      }
      const registry = await fs.readJson(REGISTRY_FILE_PATH);
      return registry as TemplateRegistry;
    } catch (error) {
      console.error(chalk.red("Error reading template registry:"), error);
      return null;
    }
  }

  /**
   * Write the project configuration file
   */
  static async writeProjectConfig(config: ProjectConfig): Promise<void> {
    try {
      await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
    } catch (error) {
      console.error(chalk.red("Error writing project config:"), error);
      throw error;
    }
  }

  /**
   * Write the template registry file
   */
  static async writeTemplateRegistry(
    registry: TemplateRegistry
  ): Promise<void> {
    try {
      await fs.writeJson(REGISTRY_FILE, registry, { spaces: 2 });
    } catch (error) {
      console.error(chalk.red("Error writing template registry:"), error);
      throw error;
    }
  }
}

export class Templates {
  /**
   * Find a template by name in the registry
   */
  static findTemplate(
    registry: TemplateRegistry,
    templateName: string
  ): Template | null {
    return (
      registry.templates.find((template) => template.title === templateName) ||
      null
    );
  }

  /**
   * Replace placeholders in template content
   */
  static replacePlaceholders(
    content: string,
    replacements: Record<string, string>
  ): string {
    let result = content;

    for (const [placeholder, value] of Object.entries(replacements)) {
      const pattern = new RegExp(`__${placeholder.toUpperCase()}__`, "g");
      result = result.replace(pattern, value);
    }

    return result;
  }

  /**
   * Get the appropriate file extension based on template type
   */

  /**
   * Convert template name to proper component name (PascalCase)
   */
  static toComponentName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }

  /**
   * Convert template name to proper hook name (camelCase with 'use' prefix)
   */
  static toHookName(name: string): string {
    const pascalCase = this.toComponentName(name);
    return `use${pascalCase}`;
  }
}

/**
 * Run Prettier on the entire project
 */
export async function runPrettier(): Promise<void> {
  try {
    Logger.info("Running Prettier to format code...");
    await execa("npx", ["prettier", "--write", "."], {
      stdio: "pipe",
    });
    Logger.success("Code formatted successfully");
  } catch (error) {
    Logger.warn("Warning: Could not run Prettier. Make sure it's installed.");
    Logger.running("You can manually format with: npx prettier --write .");
  }
}
