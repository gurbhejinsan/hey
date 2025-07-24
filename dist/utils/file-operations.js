"use strict";
// import * as fs from 'fs-extra';
// import * as path from 'path';
// import { Logger } from './logger';
// import { TemplateContext } from '../types';
// /**
//  * Utility functions for file operations
//  */
// export class FileOperations {
//   /**
//    * Check if file or directory exists
//    */
//   static async exists(filePath: string): Promise<boolean> {
//     try {
//       await fs.access(filePath);
//       return true;
//     } catch {
//       return false;
//     }
//   }
//   /**
//    * Create directory if it doesn't exist
//    */
//   static async ensureDir(dirPath: string): Promise<void> {
//     await fs.ensureDir(dirPath);
//   }
//   /**
//    * Read JSON file and parse it
//    */
//   static async readJsonFile<T>(filePath: string): Promise<T | null> {
//     try {
//       const content = await fs.readFile(filePath, 'utf-8');
//       return JSON.parse(content) as T;
//     } catch (error) {
//       Logger.error(`Failed to read JSON file: ${filePath}`);
//       return null;
//     }
//   }
//   /**
//    * Write JSON file with pretty formatting
//    */
//   static async writeJsonFile(filePath: string, data: any): Promise<void> {
//     try {
//       await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
//     } catch (error) {
//       throw new Error(`Failed to write JSON file: ${filePath}`);
//     }
//   }
//   /**
//    * Copy directory recursively with template processing
//    */
//   static async copyTemplate(context: TemplateContext): Promise<void> {
//     const { templatePath, targetPath, componentName } = context;
//     if (!(await this.exists(templatePath))) {
//       throw new Error(`Template not found: ${templatePath}`);
//     }
//     await this.ensureDir(path.dirname(targetPath));
//     const stats = await fs.stat(templatePath);
//     if (stats.isDirectory()) {
//       await this.ensureDir(targetPath);
//       const items = await fs.readdir(templatePath);
//       for (const item of items) {
//         const srcPath = path.join(templatePath, item);
//         const destPath = path.join(targetPath, item);
//         await this.copyTemplate({
//           ...context,
//           templatePath: srcPath,
//           targetPath: destPath
//         });
//       }
//     } else {
//       await this.processTemplateFile(templatePath, targetPath, componentName);
//     }
//   }
//   /**
//    * Process template file and replace placeholders
//    */
//   private static async processTemplateFile(
//     srcPath: string,
//     destPath: string,
//     componentName: string
//   ): Promise<void> {
//     try {
//       let content = await fs.readFile(srcPath, 'utf-8');
//       // Replace common placeholders
//       content = content.replace(/__COMPONENT_NAME__/g, componentName);
//       content = content.replace(/__COMPONENT_NAME_LOWER__/g, componentName.toLowerCase());
//       content = content.replace(/__COMPONENT_NAME_UPPER__/g, componentName.toUpperCase());
//       await fs.writeFile(destPath, content, 'utf-8');
//     } catch (error) {
//       throw new Error(`Failed to process template file: ${srcPath}`);
//     }
//   }
// }
//# sourceMappingURL=file-operations.js.map