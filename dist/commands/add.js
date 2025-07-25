import fs from "fs-extra";
import path from "path";
import { isProjectInitialized, runPrettier, ConfigFiles, Templates, } from "../utils/index.js";
import { Logger } from "../utils/logger.js";
import { fileURLToPath } from "url";
import { implementationInIndex } from "../utils/generateIndex.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Add command implementation
 * Adds templates from registry to the project
 */
/**
 * Get the target directory for a template based on its type
 */
function getTargetDirectory(template, config) {
    switch (template.type) {
        case "component":
            return config.folders.components;
        case "hook":
            return config.folders.hooks;
        case "provider":
            return config.folders.providers;
        case "util":
            return config.folders.utils;
        case "constant":
            return config.folders.constants;
        default:
            throw new Error(`Unknown template type: ${template.type}`);
    }
}
/**
 * Generate filename based on template and custom name
 */
function generateFilename(template, customName) {
    const baseName = customName || template.title;
    if (["component", "provider"].includes(template.type)) {
        // return `${Templates.toComponentName(baseName)}${extension}`;
        return `${template.title}.tsx`;
    }
    else if (template.type === "hook") {
        return `${baseName}.ts`;
    }
    else {
        return `${baseName}.ts`;
    }
}
/**
 * Generate placeholder replacements based on template type and name
 */
function generateReplacements(template, customName) {
    const baseName = customName || template.title;
    const replacements = {};
    if (template.placeholders) {
        template.placeholders.forEach((placeholder) => {
            switch (placeholder) {
                case "COMPONENT_NAME":
                    replacements.COMPONENT_NAME = Templates.toComponentName(baseName);
                    break;
                case "HOOK_NAME":
                    replacements.HOOK_NAME = Templates.toHookName(baseName);
                    break;
                case "FILE_NAME":
                    replacements.FILE_NAME = baseName;
                    break;
                default:
                    // For custom placeholders, use the base name
                    replacements[placeholder] = baseName;
            }
        });
    }
    return replacements;
}
export async function readTemplateFile(template) {
    try {
        const templatePath = path.resolve(__dirname, template.path); // ⬅️ replaces __dirname for CLI compatibility
        const exists = await fs.pathExists(templatePath);
        if (!exists) {
            Logger.error(` Template file not found at path: ${templatePath}`);
            return null;
        }
        const content = await import(templatePath).then((res) => res.default);
        Logger.info(`✅ Loaded template: ${template.title}`);
        return content[template?.name].replace(/__NAME__/g, template.name);
    }
    catch (error) {
        Logger.error("❌ Failed to read template file.", error);
        return null;
    }
}
/**
 * Check if file already exists and handle accordingly
 */
async function handleExistingFile(filePath, force) {
    if (await fs.pathExists(filePath)) {
        if (!force) {
            Logger.warn(`File already exists: ${filePath}`);
            Logger.running("Use --force to overwrite existing files");
            return false;
        }
        else {
            Logger.warn(`Overwriting existing file: ${filePath}`);
        }
    }
    return true;
}
/**
 * Main add command handler
 */
export async function addCommand(options) {
    try {
        // Check if project is initialized
        if (!(await isProjectInitialized())) {
            Logger.errorBox("Project Not Initialized", 'This directory is not a mycli project.\nRun "mycli init" first to initialize the project.');
            process.exit(1);
        }
        // Read project configuration and template registry
        const config = await ConfigFiles.readProjectConfig();
        const registry = await ConfigFiles.readTemplateRegistry();
        if (!config || !registry) {
            Logger.errorBox("Configuration Error", 'Could not read project configuration or template registry.\nTry running "mycli init" to reinitialize.');
            process.exit(1);
        }
        // Find the requested template
        const template = Templates.findTemplate(registry, options.template);
        if (!template) {
            const availableTemplates = registry.templates
                .map((t) => t.title)
                .join(", ");
            Logger.errorBox("Template Not Found", `Template "${options.template}" not found in registry.\n\nAvailable templates: ${availableTemplates}`);
            process.exit(1);
        }
        // Get target directory and filename
        const targetDir = getTargetDirectory(template, config);
        const filename = generateFilename(template, options.name);
        const targetPath = path.join(targetDir, filename);
        // Display template information
        Logger.displayTemplateInfo(template, targetPath);
        // Check if file already exists
        if (!(await handleExistingFile(targetPath, options.force || false))) {
            process.exit(1);
        }
        // Generate placeholder replacements
        const replacements = generateReplacements(template, options.name);
        // Process template content
        // let processedContent = template.template;
        let processedContent = (await readTemplateFile(template));
        if (Object.keys(replacements).length > 0) {
            processedContent = Templates.replacePlaceholders(processedContent, replacements);
            Logger.running(`Applied ${Object.keys(replacements).length} placeholder replacements`);
        }
        // Ensure target directory exists
        await fs.ensureDir(targetDir);
        console.log("🚀 ~ addCommand ~ targetPath:", targetPath);
        // Write the template file
        await fs.writeFile(targetPath, processedContent, "utf8");
        Logger.success(`Created: ${targetPath}`);
        await implementationInIndex(template, targetDir);
        // Run Prettier to format the code
        await runPrettier();
        console.log("");
        Logger.successBox("Template Added Successfully!", `Template "${template.title}" has been added to your project.\n\n` +
            `File: ${targetPath}\n` +
            `Type: ${template.type}\n\n` +
            `${template.dependencies && template.dependencies.length > 0
                ? `Don't forget to install dependencies:\nnpm install ${template.dependencies.join(" ")}\n\n`
                : ""}` +
            `The file has been automatically formatted with Prettier.`);
    }
    catch (error) {
        Logger.errorBox("Add Command Failed", `An error occurred while adding the template:\n${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
// export const implementationInIndex = async (
//   template: Template,
//   targetDir: string // e.g., './src/hooks'
// ) => {
//   try {
//     const indexPath = path.join(targetDir, "index.ts");
//     const generatedFilePath = path.join(
//       targetDir,
//       `${template.title}${template.type == "component" ? ".tsx" : ".ts"}`
//     ); // <- where file is written
//     const importPath = `./${template.title}`; // for import statement
//     // 1️⃣ Check files exist
//     if (!(await fs.pathExists(indexPath))) {
//       // throw new Error(`Index file not found: ${indexPath}`);
//       await fs.writeFile(indexPath, "");
//     }
//     if (!(await fs.pathExists(generatedFilePath))) {
//       throw new Error(`Generated file not found: ${generatedFilePath}`);
//     }
//     // 2️⃣ Read contents
//     let indexContent = await fs.readFile(indexPath, "utf8");
//     const content = await fs.readFile(generatedFilePath, "utf8");
//     // 3️⃣ Extract all exported symbols from the file
//     const exportNames = new Set<string>();
//     // a) export const/let/var/function/class Something
//     const namedExportRegex =
//       /export\s+(?:const|let|var|function|class)\s+(\w+)/g;
//     let match;
//     while ((match = namedExportRegex.exec(content)) !== null) {
//       exportNames.add(match[1]);
//     }
//     console.log("🚀 ~ exportNames:", exportNames.entries());
//     // b) export { symbol1, symbol2 }
//     const groupExportRegex = /export\s*{([^}]+)}/g;
//     while ((match = groupExportRegex.exec(content)) !== null) {
//       const parts = match[1].split(",").map((p) => p.trim());
//       parts.forEach((p) => p && exportNames.add(p));
//     }
//     // c) export default Something
//     const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
//     if (defaultExportMatch) {
//       exportNames.add(template.name); // use name as an alias
//     }
//     if (exportNames.size === 0) {
//       console.warn(`⚠️ No exports found in ${generatedFilePath}`);
//       return;
//     }
//     // 4️⃣ Add import statement if not already present
//     const importRegex = new RegExp(`from ['"]${importPath}['"]`);
//     if (!importRegex.test(indexContent)) {
//       let importLine = "";
//       if (defaultExportMatch && exportNames.size === 1) {
//         console.log(
//           "🚀 ~ defaultExportMatch && exportNames.size === 1: IN CON",
//           defaultExportMatch && exportNames.size === 1
//         );
//         importLine = `import ${template.name} from '${importPath}';`;
//       } else {
//         importLine = `import { ${[...exportNames].join(", ")} } from '${importPath}';`;
//       }
//       indexContent = `${importLine}\n${indexContent}`;
//     }
//     // 5️⃣ Inject into export default { ... }
//     const exportBlockRegex = /export\s+default\s*{([\s\S]*?)}/m;
//     if (exportBlockRegex.test(indexContent)) {
//       indexContent = indexContent.replace(exportBlockRegex, (match, inner) => {
//         const existing = new Set(
//           inner
//             .split(",")
//             .map((s: string) => s.trim().replace(/\n|\/\*.*\*\/|\/\/.*/g, ""))
//             .filter(Boolean)
//         );
//         const newExports = [...exportNames].filter(
//           (name) => !existing.has(name)
//         );
//         let updatedBlock = inner.trim();
//         if (updatedBlock && !updatedBlock.endsWith(",")) {
//           updatedBlock += ",";
//         }
//         updatedBlock += `\n  ${newExports.join(",\n  ")}`;
//         return `export default {\n  ${updatedBlock}\n};`;
//       });
//     } else {
//       indexContent += `\nexport default {\n  ${[...exportNames].join(",\n  ")}\n};`;
//     }
//     // 6️⃣ Save
//     await fs.writeFile(indexPath, indexContent, "utf8");
//     console.log(`✅ Index updated with exports from ${template.name}.ts`);
//   } catch (err) {
//     console.error("❌ implementationInIndex Error:", err);
//     throw err;
//   }
// };
/**
 * List all available templates
 */
export async function listTemplates() {
    try {
        const registry = await ConfigFiles.readTemplateRegistry();
        if (!registry) {
            Logger.errorBox("Registry Not Found", "Could not read template registry. Make sure you're in a mycli project directory.");
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
    }
    catch (error) {
        Logger.errorBox("List Command Failed", `An error occurred while listing templates:\n${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
//# sourceMappingURL=add.js.map