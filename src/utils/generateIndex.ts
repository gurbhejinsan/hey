import path from "path";
import { Template } from "../types.js";
import fs from "fs-extra";

export const implementationInIndex = async (
  template: Template,
  targetDir: string // e.g., './src/hooks'
) => {
  try {
    const isProvider = template.type === "provider";
    const isTSX = ["component", "provider"].includes(template.type);
    const indexPath = path.join(targetDir, isTSX ? "index.tsx" : "index.ts");
    const generatedFilePath = path.join(
      targetDir,
      `${template.title + (isTSX ? ".tsx" : ".ts")}`
    ); // <- where file is written
    const importPath = `./${template.title}`; // for import statement

    // 1️⃣ Check files exist
    if (!(await fs.pathExists(indexPath))) {
      // throw new Error(`Index file not found: ${indexPath}`);
      await fs.writeFile(indexPath, "");
    }

    if (!(await fs.pathExists(generatedFilePath))) {
      throw new Error(`Generated file not found: ${generatedFilePath}`);
    }

    if (isProvider) {
      providerWrapper({
        templateName: template.name,
        generatedFilePath,
        importPath,
        indexPath,
      });
      return;
    }

    // 2️⃣ Read contents
    let indexContent = await fs.readFile(indexPath, "utf8");

    const { defaultExportMatch, exportNames } = await exportContent(
      template.name,
      generatedFilePath
    );

    if (exportNames.size === 0) {
      console.warn(`⚠️ No exports found in ${generatedFilePath}`);
      return;
    }
    // 4️⃣ Add import statement if not already present
    const importRegex = new RegExp(`from ['"]${importPath}['"]`);
    if (!importRegex.test(indexContent)) {
      let importLine = "";

      if (defaultExportMatch && exportNames.size === 1) {
        importLine = `export  {deafult as ${template.name}  }from '${importPath}';`;
      } else {
        importLine = `export  { ${[...exportNames].join(", ")} } from '${importPath}';`;
      }

      indexContent = `${importLine}\n${indexContent}`;
    }

    await fs.writeFile(indexPath, indexContent, "utf8");
    console.log(`✅ Index updated with exports from ${template.name}.ts`);
  } catch (err) {
    console.error("❌ implementationInIndex Error:", err);
    throw err;
  }
};

const exportContent = async (name: string, generatedFilePath: string) => {
  const content = await fs.readFile(generatedFilePath, "utf8");

  const exportNames = new Set<string>();

  // a) export const/let/var/function/class Something
  const namedExportRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g;
  let match;
  while ((match = namedExportRegex.exec(content)) !== null) {
    exportNames.add(match[1]);
  }

  // b) export { symbol1, symbol2 }
  const groupExportRegex = /export\s*{([^}]+)}/g;
  while ((match = groupExportRegex.exec(content)) !== null) {
    const parts = match[1].split(",").map((p) => p.trim());
    parts.forEach((p) => p && exportNames.add(p));
  }

  // c) export default Something
  const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
  if (defaultExportMatch) {
    exportNames.add(name); // use name as an alias
  }

  return { exportNames, defaultExportMatch };
};

/**
 * JSX wrapper for provider
 */
type ProviderTempleplate = {
  templateName: Template["name"];
  indexPath: string;
  generatedFilePath: string;
  importPath: string;
};
const providerWrapper = async ({
  generatedFilePath,
  importPath,
  indexPath,
  templateName,
}: ProviderTempleplate) => {
  let indexContent = await fs.readFile(indexPath, "utf8");
  const { defaultExportMatch, exportNames } = await exportContent(
    templateName,
    generatedFilePath
  );

  if (exportNames.size === 0) {
    console.warn(`⚠️ No exports found in ${generatedFilePath}`);
    return;
  }

  // 4️⃣ Add import statement if not already present
  const importRegex = new RegExp(`from ['"]${importPath}['"]`);
  if (!importRegex.test(indexContent)) {
    let importLine = "";

    if (defaultExportMatch && exportNames.size === 1) {
      importLine = `import ${templateName} from '${importPath}';`;
    } else {
      importLine = `import { ${[...exportNames].join(", ")} } from '${importPath}';`;
    }

    indexContent = `${importLine}\n${indexContent}`;
  }

  // 1️⃣ Try block JSX: return ( <div>{children}</div> );
  let jsxMatch = indexContent.match(/return\s*\(\s*([\s\S]+?)\s*\);/m);

  if (jsxMatch) {
    const originalJSX = jsxMatch[1].trim();
    if (!originalJSX.includes(`<${templateName}>`)) {
      const wrapped = `<${templateName}>\n  ${originalJSX}\n</${templateName}>`;
      indexContent = indexContent.replace(
        jsxMatch[0],
        `return (\n  ${wrapped}\n);`
      );
    }
  } else {
    // 2️⃣ Try inline JSX: return <div>{children}</div>;
    jsxMatch = indexContent.match(/return\s+<([\s\S]+?)>;/m);

    if (jsxMatch) {
      const jsx = jsxMatch[0]; // full line like: return <div>{children}</div>;
      const inner = jsx
        .replace(/return\s+/, "")
        .replace(/;$/, "")
        .trim();
      if (!inner.includes(`<${templateName}>`)) {
        const wrapped = `<${templateName}>\n  ${inner}\n</${templateName}>`;
        indexContent = indexContent.replace(jsx, `return (\n  ${wrapped}\n);`);
      }
    } else {
      console.warn("⚠️ No recognizable return JSX found to wrap.");
    }
  }

  await fs.writeFile(indexPath, indexContent, "utf8");
  console.log(`✅ Wrapped Provider with ${templateName}`);
  return;
};
