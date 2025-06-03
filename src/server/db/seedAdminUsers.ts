// src/server/db/seedAdminUsers.ts
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Configura tu conexión a la base de datos (ajusta según tu .env o configuración)
// Es importante que este script pueda conectarse a la BD donde quieres crear los usuarios.
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost", // Si corres este script localmente y la BD está en Docker, podría ser 'localhost' o el host de Docker.
                                            // Si la BD está en producción, usa las credenciales de producción.
    database: process.env.DB_NAME || "website_db",
    password: process.env.DB_PASSWORD || "postgres",
    port: parseInt(process.env.DB_PORT || "5432"),
});

const adminUsersToCreate = [
  {
    username: 'CampomarAdmin', // Nombre de usuario único
    password: 'Campoma2025.', // La contraseña en texto plano
    name: 'Administrador Principal'
  },
  {
    username: 'CampomarAdmin2',
    password: 'Campoma2025-2.', // La contraseña en texto plano
    name: 'Administrador Secundario'
  }
];

async function createAdminUsers() {
  const client = await pool.connect();
  try {
    for (const admin of adminUsersToCreate) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(admin.password, saltRounds);
      const userId = uuidv4();

      // Usamos ON CONFLICT para evitar errores si el usuario ya existe (basado en el username que es UNIQUE)
      // Si el usuario existe, no hace nada. Podrías cambiarlo a DO UPDATE si quisieras actualizarlo.
      await client.query(
        `INSERT INTO admin_users (id, username, password_hash, name) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (username) DO NOTHING`,
        [userId, admin.username, passwordHash, admin.name]
      );
      console.log(`Usuario admin "${admin.username}" procesado (creado o ya existía).`);
    }
  } catch (err) {
    console.error("Error creando usuarios admin:", err);
  } finally {
    client.release();
    await pool.end(); // Cierra el pool cuando termines
    console.log("Proceso de creación de usuarios admin finalizado.");
  }
}

createAdminUsers();