import { ConfigFiles } from "../utils/index.js";
import { Logger } from "../utils/logger.js";

/**
 * List all available templates
 */
export async function listTemplates(): Promise<void> {
  try {
    const registry = await ConfigFiles.readTemplateRegistry();

    if (!registry) {
      Logger.errorBox(
        "Registry Not Found",
        "Could not read template registry. Make sure you're in a mycli project directory."
      );
      process.exit(1);
    }

    if (registry.templates.length === 0) {
      Logger.warn("No templates found in registry.");
      return;
    }

    Logger.bold("blue", `Available Templates (${registry.templates.length})`);
    Logger.divider();
    registry.templates.forEach((template) => {
      Logger.success(`${template.title} (${template.type})`);
      Logger.running(template.description);
      if (template.dependencies && template.dependencies.length > 0) {
        Logger.running(`  Dependencies: ${template.dependencies.join(", ")}`);
      }
      console.log("");
    });
  } catch (error) {
    Logger.errorBox(
      "List Command Failed",
      `An error occurred while listing templates:\n${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }
}
