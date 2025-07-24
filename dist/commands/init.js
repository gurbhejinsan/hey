import path from "path";
import { isProjectInitialized, createProjectDirectories, ConfigFiles, } from "../utils/index.js";
import { Logger } from "../utils/logger.js";
/**
 * Initialize command implementation
 * Creates project configuration, template registry, and folder structure
 */
/**
 * Default project configuration
 */
function createDefaultConfig(projectName) {
    return {
        name: projectName,
        version: "1.0.0",
        folders: {
            components: "src/components",
            hooks: "src/hooks",
            providers: "src/providers",
            utils: "src/utils",
            constants: "src/constants",
        },
        createdAt: new Date().toISOString(),
    };
}
/**
 * Main init command handler
 */
export async function initCommand(options = {}) {
    try {
        // Check if project is already initialized
        if (!options.force && (await isProjectInitialized())) {
            Logger.errorBox("Project Already Initialized", "This directory already contains a mycli project.\nUse --force to reinitialize.");
            process.exit(1);
        }
        // Get project name from options or current directory
        const projectName = options.name || path.basename(process.cwd());
        Logger.info(`Initializing mycli project: ${Logger.bold("blue", projectName)}`);
        Logger.divider();
        // Create default configuration
        const config = createDefaultConfig(projectName);
        Logger.info("Creating project configuration...");
        await ConfigFiles.writeProjectConfig(config);
        Logger.success("Created myproject.config.json");
        // Create project directories
        Logger.info("Creating project directories...");
        await createProjectDirectories(config);
        Logger.divider();
        Logger.successBox("Project Initialized Successfully!", `Project "${projectName}" has been initialized with:\n\n` +
            `• Configuration file: myproject.config.json\n` +
            `• Template registry: .mycli.registry.json\n` +
            `• ${Object.keys(config.folders).length} project directories\n` +
            // `• ${registry.templates.length} example templates\n\n` +
            `Next steps:\n` +
            `• Run "mycli add button" to add a button component\n` +
            `• Run "mycli add use-auth" to add an auth hook\n` +
            `• Customize templates in .mycli.registry.json`);
    }
    catch (error) {
        Logger.errorBox("Initialization Failed", `An error occurred during project initialization:\n${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map