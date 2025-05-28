import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'website_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, category_id, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, description, category_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, category_id, image_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, image_url } = req.body;
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, category_id = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [name, description, category_id, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// Product Categories
app.get('/api/product-categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM product_categories');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product categories' });
  }
});

app.post('/api/product-categories', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO product_categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product category' });
  }
});

app.delete('/api/product-categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM product_categories WHERE id = $1', [id]);
    res.json({ message: 'Product category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product category' });
  }
});

// Social Media
app.get('/api/social-media', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM social_media');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching social media' });
  }
});

app.put('/api/social-media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url } = req.body;
    const result = await pool.query(
      'UPDATE social_media SET platform = $1, url = $2 WHERE id = $3 RETURNING *',
      [platform, url, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating social media' });
  }
});

// Phone Numbers
app.get('/api/phone-numbers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM phone_numbers');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching phone numbers' });
  }
});

app.post('/api/phone-numbers', async (req, res) => {
  try {
    const { number, description } = req.body;
    const result = await pool.query(
      'INSERT INTO phone_numbers (number, description) VALUES ($1, $2) RETURNING *',
      [number, description]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating phone number' });
  }
});

app.put('/api/phone-numbers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, description } = req.body;
    const result = await pool.query(
      'UPDATE phone_numbers SET number = $1, description = $2 WHERE id = $3 RETURNING *',
      [number, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating phone number' });
  }
});

app.delete('/api/phone-numbers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM phone_numbers WHERE id = $1', [id]);
    res.json({ message: 'Phone number deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting phone number' });
  }
});

// Business Hours
app.get('/api/business-hours', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM business_hours LIMIT 1');
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching business hours' });
  }
});

app.put('/api/business-hours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { days, hours } = req.body;
    const result = await pool.query(
      'UPDATE business_hours SET days = $1, hours = $2 WHERE id = $3 RETURNING *',
      [days, hours, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating business hours' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});