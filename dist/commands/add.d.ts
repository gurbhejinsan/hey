import type { AddOptions, Template } from "../types.js";
export declare function readTemplateFile(template: Template): Promise<string | null>;
/**
 * Main add command handler
 */
export declare function addCommand(options: AddOptions): Promise<void>;
/**
 * List all available templates
 */
export declare function listTemplates(): Promise<void>;
//# sourceMappingURL=add.d.ts.map