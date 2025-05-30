-- Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
name VARCHAR(255),
email VARCHAR(100) UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar usuarios iniciales
\i users.sql

-- Crear la tabla business_hours
CREATE TABLE IF NOT EXISTS business_hours (
id VARCHAR(255) PRIMARY KEY,
days VARCHAR(255),
hours VARCHAR(255)
);

-- Insertar datos de business_hours
\i business_hours.sql

-- Crear la tabla contact_info
CREATE TABLE IF NOT EXISTS contact_info (
id VARCHAR(255) PRIMARY KEY,
icon VARCHAR(255),
text VARCHAR(255),
show_on_mobile BOOLEAN
);

-- Insertar datos de contact_info
\i contact_info.sql

-- Crear la tabla banner_slides
CREATE TABLE IF NOT EXISTS banner_slides (
id VARCHAR(255) PRIMARY KEY,
image VARCHAR(255),
title VARCHAR(255),
subtitle VARCHAR(255)
);

-- Insertar datos de banner_slides
\i banner_slides.sql

-- Crear la tabla timeline_events
CREATE TABLE IF NOT EXISTS timeline_events (
id VARCHAR(255) PRIMARY KEY,
year VARCHAR(255),
title VARCHAR(255),
description TEXT
);

-- Insertar datos de timeline_events
\i timeline_events.sql

-- Crear la tabla product_categories
CREATE TABLE IF NOT EXISTS product_categories (
id VARCHAR(255) PRIMARY KEY,
name VARCHAR(255)
);

-- Insertar datos de product_categories
\i product_categories.sql

-- Crear la tabla social_media
CREATE TABLE IF NOT EXISTS social_media (
id VARCHAR(255) PRIMARY KEY,
name VARCHAR(255),
icon VARCHAR(255),
url VARCHAR(255)
);

-- Insertar datos de social_media
\i social_media.sql

-- Crear la tabla phone_numbers
CREATE TABLE IF NOT EXISTS phone_numbers (
id VARCHAR(255) PRIMARY KEY,
number VARCHAR(255),
label VARCHAR(255)
);

-- Insertar datos de phone_numbers
\i phone_numbers.sql

-- Crear la tabla products
CREATE TABLE IF NOT EXISTS products (
id VARCHAR(255) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
logo VARCHAR(255),
category_id VARCHAR(255) REFERENCES product_categories(id)
);

-- Insertar datos de products
\i products.sql
