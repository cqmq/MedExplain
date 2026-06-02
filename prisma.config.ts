import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

const databaseUrl = env("DATABASE_URL");

function ensureSqliteFile(url: string) {
  if (!url.startsWith("file:")) return;

  const dbPath = url.replace(/^file:/, "");
  if (dbPath === ":memory:") return;

  const absolutePath = path.isAbsolute(dbPath)
    ? dbPath
    : path.resolve(process.cwd(), dbPath);

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  if (!fs.existsSync(absolutePath)) {
    fs.closeSync(fs.openSync(absolutePath, "a"));
  }
}

ensureSqliteFile(databaseUrl);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
