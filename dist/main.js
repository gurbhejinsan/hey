#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { addCommand, listTemplates } from "./commands/add.js";
import { Logger } from "./utils/logger.js";
/**
 * MyCLI - A CLI tool for managing reusable code templates
 *
 * This is the main entry point that sets up the CLI interface
 * and routes commands to their respective handlers.
 */
const CLI_VERSION = "1.0.0";
/**
 * Display the CLI banner
 */
function displayBanner() {
    console.log(chalk.blue.bold(`
 ┌─────────────────────────────────────┐
 │           MyCLI v${CLI_VERSION}             │
 │   Manage Reusable Code Templates    │
 └─────────────────────────────────────┘
  `));
}
/**
 * Global error handler
 */
process.on("unhandledRejection", (reason, promise) => {
    console.error(Logger.error("Unhandled Rejection at:"), promise, Logger.error("reason:"), reason);
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    Logger.error(`Uncaught Exception: `, error);
    process.exit(1);
});
/**
 * Main CLI setup and command routing
 */
async function main() {
    const argv = await yargs(hideBin(process.argv))
        .scriptName("mycli")
        .version(CLI_VERSION)
        .usage("$0 <command> [options]")
        .help("help")
        .alias("h", "help")
        .alias("v", "version")
        .wrap(Math.min(120, process.stdout.columns || 80))
        .command("init [name]", "Initialize a new mycli project", (yargs) => {
        return yargs
            .positional("name", {
            describe: "Project name (defaults to current directory name)",
            type: "string",
        })
            .option("force", {
            alias: "f",
            type: "boolean",
            description: "Force initialization even if project already exists",
            default: false,
        });
    }, async (argv) => {
        displayBanner();
        await initCommand({
            name: argv.name,
            force: argv.force,
        });
    })
        .command("add <template> [name]", "Add a template to your project", (yargs) => {
        return yargs
            .positional("template", {
            describe: "Template name to add",
            type: "string",
            demandOption: true,
        })
            .positional("name", {
            describe: "Custom name for the generated file",
            type: "string",
        })
            .option("force", {
            alias: "f",
            type: "boolean",
            description: "Overwrite existing files",
            default: false,
        });
    }, async (argv) => {
        await addCommand({
            template: argv.template,
            name: argv.name,
            force: argv.force,
        });
    })
        .command("list", "List all available templates", () => { }, async () => {
        await listTemplates();
    })
        .example("$0 init my-project", 'Initialize a new project called "my-project"')
        .example("$0 add button", "Add the button template to your project")
        .example("$0 add button MyCustomButton", "Add button template with custom name")
        .example("$0 list", "List all available templates")
        .demandCommand(1, "You need at least one command before moving on")
        .strict()
        .recommendCommands()
        .parse();
}
// Handle CLI execution
main().catch((error) => {
    Logger.error(`CLI Error: `, error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map