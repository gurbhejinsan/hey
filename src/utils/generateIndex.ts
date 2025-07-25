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

    // 2️⃣ Read contents
    let indexContent = await fs.readFile(indexPath, "utf8");
    const content = await fs.readFile(generatedFilePath, "utf8");

    // 3️⃣ Extract all exported symbols from the file
    const exportNames = new Set<string>();

    // a) export const/let/var/function/class Something
    const namedExportRegex =
      /export\s+(?:const|let|var|function|class)\s+(\w+)/g;
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
      exportNames.add(template.name); // use name as an alias
    }

    if (exportNames.size === 0) {
      console.warn(`⚠️ No exports found in ${generatedFilePath}`);
      return;
    }

    // 4️⃣ Add import statement if not already present
    const importRegex = new RegExp(`from ['"]${importPath}['"]`);
    if (!importRegex.test(indexContent)) {
      let importLine = "";

      if (defaultExportMatch && exportNames.size === 1) {
        importLine = `import ${template.name} from '${importPath}';`;
      } else {
        importLine = `import { ${[...exportNames].join(", ")} } from '${importPath}';`;
      }

      indexContent = `${importLine}\n${indexContent}`;
    }

    if (isProvider) {


      // 1️⃣ Try block JSX: return ( <div>{children}</div> );
      let match = indexContent.match(/return\s*\(\s*([\s\S]+?)\s*\);/m);

      if (match) {
        const originalJSX = match[1].trim();
        if (!originalJSX.includes(`<${template.name}>`)) {
          const wrapped = `<${template.name}>\n  ${originalJSX}\n</${template.name}>`;
          indexContent = indexContent.replace(
            match[0],
            `return (\n  ${wrapped}\n);`
          );
        }
      } else {
        // 2️⃣ Try inline JSX: return <div>{children}</div>;
        match = indexContent.match(/return\s+<([\s\S]+?)>;/m);

        if (match) {
          const jsx = match[0]; // full line like: return <div>{children}</div>;
          const inner = jsx
            .replace(/return\s+/, "")
            .replace(/;$/, "")
            .trim();
          if (!inner.includes(`<${template.name}>`)) {
            const wrapped = `<${template.name}>\n  ${inner}\n</${template.name}>`;
            indexContent = indexContent.replace(
              jsx,
              `return (\n  ${wrapped}\n);`
            );
          }
        } else {
          console.warn("⚠️ No recognizable return JSX found to wrap.");
        }
      }

      await fs.writeFile(indexPath, indexContent, "utf8");
      console.log(`✅ Wrapped Provider with ${template.name}`);
      return;
    }

 
    const exportBlockRegex = /export\s+default\s*{([\s\S]*?)}/m;

    if (exportBlockRegex.test(indexContent)) {
      indexContent = indexContent.replace(exportBlockRegex, (match, inner) => {
        const existing = new Set(
          inner
            .split(",")
            .map((s: string) => s.trim().replace(/\n|\/\*.*\*\/|\/\/.*/g, ""))
            .filter(Boolean)
        );

        const newExports = [...exportNames].filter(
          (name) => !existing.has(name)
        );
        let updatedBlock = inner.trim();

        if (updatedBlock && !updatedBlock.endsWith(",")) {
          updatedBlock += ",";
        }

        updatedBlock += `\n  ${newExports.join(",\n  ")}`;

        return `export default {\n  ${updatedBlock}\n};`;
      });
    } else {
      indexContent += `\nexport default {\n  ${[...exportNames].join(",\n  ")}\n};`;
    }

    // 6️⃣ Save
    await fs.writeFile(indexPath, indexContent, "utf8");
    console.log(`✅ Index updated with exports from ${template.name}.ts`);
  } catch (err) {
    console.error("❌ implementationInIndex Error:", err);
    throw err;
  }
};



