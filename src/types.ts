/**
 * Type definitions for the CLI tool
 */

export interface ProjectConfig {
  name: string;
  version: string;
  folders: {
    components: string;
    hooks: string;
    providers: string;
    utils: string;
    constants: string;
  };
  createdAt: string;
}

export interface TemplateRegistry {
  templates: Template[];
  version: string;
  lastUpdated: string;
}

export interface Template {
  title: string;
  type: "component" | "hook" | "provider" | "util" | "constant";
  path: string;
  name: string;
  description: string;
  template: string;
  placeholders?: string[];
  dependencies?: string[];
}

export interface CliArguments {
  _: string[];
  [key: string]: any;
}

export interface InitOptions {
  name?: string;
  force?: boolean;
}

export interface AddOptions {
  template: string;
  name?: string;
  force?: boolean;
}
