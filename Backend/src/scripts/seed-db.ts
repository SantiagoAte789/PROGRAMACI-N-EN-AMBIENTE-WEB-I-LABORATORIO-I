import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";
import { pool } from "../config/database";

async function seedDatabase(): Promise<void> {
  try {
    const sqlPath = path.resolve(
      process.cwd(),
      "src/database",
      "seed.sql"
    );

    const sql = await readFile(sqlPath, "utf-8");

    await pool.query(sql);

    console.log("Datos insertados correctamente");
  } catch (error) {
    console.error("Error al insertar los datos:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedDatabase();