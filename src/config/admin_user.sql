CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Para almacenar la contraseña hasheada
    name VARCHAR(255)
    -- Puedes añadir otros campos como email, roles, etc., si es necesario
);
