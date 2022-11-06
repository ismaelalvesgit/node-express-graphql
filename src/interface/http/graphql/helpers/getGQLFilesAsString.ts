import * as fs from "fs";

/**
 * Import all gql schemas from a directory and returns as string
 */
export function importSchemas(dir: string): string {
  const schemas: string[] = [];

  fs.readdirSync(dir).forEach(file => {
    const FULL_PATH = `${dir}/${file}`;
    const stat = fs.statSync(FULL_PATH);
    if (stat.isDirectory()) {
      schemas.push(importSchemas(FULL_PATH));
    } else if (stat.isFile() && file.includes("graphql")) {
      const schema = fs.readFileSync(FULL_PATH, "utf8");

      schemas.push(schema);
    }
  });

  return schemas.join("");
}
