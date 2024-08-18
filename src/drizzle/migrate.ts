import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";
import postgres from "postgres";

const db = drizzle(postgres(process.env.DATABASE_URL as string), {
  logger: true,
  schema,
});

const sql = postgres(process.env.DATABASE_URL as string, { max: 1 });

const m = async () => {
  console.log(process.env.DATABASE_URL);
  await migrate(db, { migrationsFolder: "src/drizzle/migrations" });
  await sql.end();
};

m();
