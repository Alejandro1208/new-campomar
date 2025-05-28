import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool(config.db);

export const initializeDatabase = async () => {
  try {
    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES product_categories(id)
      );
    `);

    // Create product_categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    // Create social_media table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_media (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        url VARCHAR(255) NOT NULL
      );
    `);

    // Create phone_numbers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS phone_numbers (
        id SERIAL PRIMARY KEY,
        number VARCHAR(50) NOT NULL,
        label VARCHAR(100)
      );
    `);

    // Create business_hours table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS business_hours (
        id SERIAL PRIMARY KEY,
        days VARCHAR(255) NOT NULL,
        hours VARCHAR(100) NOT NULL
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const db = pool;