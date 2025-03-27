import { defineConfig } from "drizzle-kit";

const url = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${
  process.env.PGHOST
}:${
  process.env.PGPORT
}/${process.env.PGDATABASE}`;

if (url === "postgres://:@:/") {
  throw new Error("Missing connection params");
}

console.log('@@ DATABASE_URL', url);

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
