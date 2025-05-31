import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON en el body de las requests


app.use(express.static(path.join(__dirname, "public")));

// Configuración del Pool de Conexiones a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "db", // Debería ser 'db' si corre en Docker y se conecta al servicio 'db'
    database: process.env.DB_NAME || "website_db",
    password: process.env.DB_PASSWORD || "postgres",
    port: parseInt(process.env.DB_PORT || "5432"),
});
export interface Image { // Definición para un objeto de imagen individual
    id: string;
    src: string; // Esta será la ruta o URL de la imagen
    alt: string;
  }

// Middleware de manejo de errores genérico (opcional, pero útil)
const handleAsync = (
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
) => {
    // Cambiado Promise<void> a Promise<any> y añadido next opcional
    return (req: Request, res: Response, next: NextFunction) => {
        // El handler devuelto SÍ debe aceptar next
        fn(req, res, next).catch((error) => {
            // Llama a fn y si hay error, lo pasamos al siguiente middleware de error o lo manejamos aquí
            console.error("API Error (interceptado por handleAsync):", error);
            if (!res.headersSent) {
                // Importante para no enviar múltiples respuestas
                res.status(500).json({
                    error: "Internal Server Error (desde handleAsync)",
                });
            }
            // O podrías usar next(error) si tienes un middleware de error global definido más abajo
        });
    };
};


const UPLOAD_DIR_PRODUCT_LOGOS = "public/uploads/product_logos";

const absoluteUploadDirProductLogos = path.join(__dirname, UPLOAD_DIR_PRODUCT_LOGOS);
fs.mkdirSync(absoluteUploadDirProductLogos, { recursive: true });

const productLogoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, absoluteUploadDirProductLogos);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            "productlogo-" + // Prefijo diferente para logos de producto
            uniqueSuffix +
            path.extname(file.originalname)
        );
    },
});

const productLogoUpload = multer({
    storage: productLogoStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB para logos (ajusta si es necesario)
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            new Error(
                "Error: Tipo de archivo no permitido para logo. Solo se permiten JPEG, JPG, PNG, WEBP."
            )
        );
    },
});

// --- Nuevo Endpoint para Subir LOGOS DE PRODUCTOS ---
app.post(
    "/api/upload/product-logo",
    productLogoUpload.single("productLogo"), 
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            res.status(400).json({ error: "No se subió ningún archivo de logo." });
            return;
        }
        try {
            const relativePath = path
                .join("uploads/product_logos", req.file!.filename)
                .replace(/\\/g, "/");
            const publicUrl = `<span class="math-inline">\{req\.protocol\}\://</span>{req.get("host")}/${relativePath}`;
            res.status(201).json({
                message: "Logo de producto subido exitosamente!",
                filePath: `/${relativePath}`, 
                publicUrl: publicUrl,
            });
        } catch (processingError) {
            next(processingError);
        }
    },
    // Middleware de manejo de errores específico para esta ruta (Multer/fileFilter)
    (error: any, req: Request, res: Response, next: NextFunction): void => {
        if (res.headersSent) {
            return next(error);
        }
        if (error instanceof multer.MulterError) {
            res.status(400).json({ error: `Error de Multer (logo): ${error.message}` });
            return;
        } else if (error && error.message) {
            res.status(400).json({ error: error.message });
            return;
        } else if (error) {
            console.error("Error inesperado durante la subida de logo de producto:", error);
            res.status(500).json({ error: "Error interno procesando el logo del producto." });
            return;
        }
        next();
    }
);



// --- 5. Configuración de Multer para la subida de imágenes ---
const UPLOAD_DIR_COMPANY = "public/uploads/company_images";

// Asegurarse de que el directorio de subida exista
fs.mkdirSync(path.join(__dirname, UPLOAD_DIR_COMPANY), { recursive: true });

const companyImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, UPLOAD_DIR_COMPANY)); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        // Crear un nombre de archivo único para evitar colisiones
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const companyImageUpload = multer({
    storage: companyImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo (ajusta según necesites)
    fileFilter: function (req, file, cb) {
        // Validar tipos de archivo
        const allowedTypes = /jpeg|jpg|png|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            new Error(
                "Error: Tipo de archivo no permitido. Solo se permiten JPEG, JPG, PNG, WEBP."
            )
        );
    },
});

// --- 6. Nuevo Endpoint para Subir Imágenes de CompanyInfo ---

// Snippet del usuario:
app.post(
  "/api/upload/company-image",
  companyImageUpload.single("companyImage"), // Middleware de Multer para procesar el archivo
  (req: Request, res: Response, next: NextFunction) => { // Manejador principal de la ruta
      if (!req.file) {
          // Si no hay archivo, enviamos un error y detenemos la ejecución aquí.
          res.status(400).json({ error: "No se subió ningún archivo." });
          return; // IMPORTANTE: Añadir return para salir de la función.
      }

      // Si hay un archivo, procedemos a construir la respuesta.
      try {
          // Usamos el operador de aserción no nula (!) porque ya verificamos req.file arriba.
          const relativePath = path
              .join("uploads/company_images", req.file!.filename) 
              .replace(/\\/g, "/"); // Asegurar slashes para URL
          
          const publicUrl = `${req.protocol}://${req.get("host")}/${relativePath}`;

          res.status(201).json({
              message: "Archivo subido exitosamente!",
              filePath: `/${relativePath}`, // Ruta para usar en <img src> o guardar en la BD
              publicUrl: publicUrl,       // URL completa si la necesitas
          });
      } catch (processingError) {
          // Si hay un error procesando el nombre del archivo o la URL,
          // pasarlo al siguiente manejador de errores (el que definimos a continuación).
          next(processingError);
      }
  },
  // Middleware de manejo de errores específico para esta ruta (para errores de Multer o del fileFilter)
  (error: any, req: Request, res: Response, next: NextFunction): void => {
      if (res.headersSent) { // Si ya se envió una respuesta, delegar a Express
          return next(error);
      }

      if (error instanceof multer.MulterError) {
          // Un error conocido de Multer (ej. límite de tamaño excedido)
          res.status(400).json({ error: `Error de Multer: ${error.message}` });
          return; 
      } else if (error && error.message && error.message.includes("Tipo de archivo no permitido")) {
          // El error específico de nuestro fileFilter
          res.status(400).json({ error: error.message });
          return; 
      } else if (error) {
          // Otros errores que pudieron ser pasados con next(error) desde el manejador principal
          // o errores desconocidos que ocurrieron en Multer y no son MulterError.
          console.error("Error inesperado durante la subida de imagen para Company Info:", error);
          res.status(500).json({ error: "Error interno del servidor procesando el archivo." });
          return;
      }
      
      // Si este middleware de error fue llamado sin un objeto 'error' 
      // (lo cual es muy poco común para un manejador de errores), simplemente pasa al siguiente.
      next();
  }
);

// --- Products ---
app.get(
    "/api/products",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM products ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/products",
    handleAsync(async (req, res) => {
        const { name, description, category_id, logo } = req.body; // Corregido: image_url -> logo
        // Aquí deberías añadir validación para los datos de entrada
        const result = await pool.query(
            "INSERT INTO products (name, description, category_id, logo) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, description, category_id, logo]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/products/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { name, description, category_id, logo } = req.body; // Corregido: image_url -> logo
        const result = await pool.query(
            "UPDATE products SET name = $1, description = $2, category_id = $3, logo = $4 WHERE id = $5 RETURNING *",
            [name, description, category_id, logo, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/products/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(204).send(); // No content, o puedes enviar un mensaje
    })
);

// --- Product Categories ---
app.get(
    "/api/product-categories",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM product_categories ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/product-categories",
    handleAsync(async (req, res) => {
        const { name } = req.body;
        const result = await pool.query(
            "INSERT INTO product_categories (name) VALUES ($1) RETURNING *",
            [name]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/product-categories/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const result = await pool.query(
            "UPDATE product_categories SET name = $1 WHERE id = $2 RETURNING *",
            [name, id]
        );
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Product category not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/product-categories/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        // Considerar qué pasa con los productos que usan esta categoría (ej. ponerlos en "Sin categoría" o impedir borrado)
        const result = await pool.query(
            "DELETE FROM product_categories WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ error: "Product category not found" });
        }
        res.status(204).send();
    })
);

// --- Social Media ---
app.get(
    "/api/social-media",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM social_media ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/social-media",
    handleAsync(async (req, res) => {
        const { name, icon, url } = req.body; // Corregido: platform -> name
        const result = await pool.query(
            "INSERT INTO social_media (name, icon, url) VALUES ($1, $2, $3) RETURNING *",
            [name, icon, url]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/social-media/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { name, icon, url } = req.body; // Corregido: platform -> name
        const result = await pool.query(
            "UPDATE social_media SET name = $1, icon = $2, url = $3 WHERE id = $4 RETURNING *",
            [name, icon, url, id]
        );
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Social media link not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/social-media/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM social_media WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ error: "Social media link not found" });
        }
        res.status(204).send();
    })
);

// --- Phone Numbers ---
app.get(
    "/api/phone-numbers",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM phone_numbers ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/phone-numbers",
    handleAsync(async (req, res) => {
        const { number, label } = req.body; // Corregido: description -> label
        const result = await pool.query(
            "INSERT INTO phone_numbers (number, label) VALUES ($1, $2) RETURNING *",
            [number, label]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/phone-numbers/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { number, label } = req.body; // Corregido: description -> label
        const result = await pool.query(
            "UPDATE phone_numbers SET number = $1, label = $2 WHERE id = $3 RETURNING *",
            [number, label, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Phone number not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/phone-numbers/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM phone_numbers WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Phone number not found" });
        }
        res.status(204).send();
    })
);

// --- Business Hours ---
app.get(
    "/api/business-hours",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM business_hours ORDER BY id ASC"
        ); // Devuelve todas
        res.json(result.rows);
    })
);

app.post(
    "/api/business-hours",
    handleAsync(async (req, res) => {
        const { id, days, hours } = req.body; // Asumimos que el id también se envía o se genera
        const result = await pool.query(
            "INSERT INTO business_hours (id, days, hours) VALUES ($1, $2, $3) RETURNING *",
            [id, days, hours]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/business-hours/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { days, hours } = req.body;
        const result = await pool.query(
            "UPDATE business_hours SET days = $1, hours = $2 WHERE id = $3 RETURNING *",
            [days, hours, id]
        );
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Business hours entry not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/business-hours/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM business_hours WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ error: "Business hours entry not found" });
        }
        res.status(204).send();
    })
);

// --- Banner Slides ---
app.get(
    "/api/banner-slides",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM banner_slides ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/banner-slides",
    handleAsync(async (req, res) => {
        const { id, image, title, subtitle } = req.body; // Asumimos que el id también se envía o se genera
        const result = await pool.query(
            "INSERT INTO banner_slides (id, image, title, subtitle) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, image, title, subtitle]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/banner-slides/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { image, title, subtitle } = req.body;
        const result = await pool.query(
            "UPDATE banner_slides SET image = $1, title = $2, subtitle = $3 WHERE id = $4 RETURNING *",
            [image, title, subtitle, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Banner slide not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/banner-slides/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM banner_slides WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Banner slide not found" });
        }
        res.status(204).send();
    })
);

// --- Menu Items ---
app.get(
    "/api/menu-items",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM menu_items ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/menu-items",
    handleAsync(async (req, res) => {
        const { id, text, url } = req.body; // Asumimos que el id también se envía o se genera
        const result = await pool.query(
            "INSERT INTO menu_items (id, text, url) VALUES ($1, $2, $3) RETURNING *",
            [id, text, url]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/menu-items/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { text, url } = req.body;
        const result = await pool.query(
            "UPDATE menu_items SET text = $1, url = $2 WHERE id = $3 RETURNING *",
            [text, url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Menu item not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/menu-items/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM menu_items WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Menu item not found" });
        }
        res.status(204).send();
    })
);

// --- Company Info ---
app.get(
    "/api/company-info",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM company_info WHERE id = '1'"
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            // Opcional: crear una entrada por defecto si no existe
            res.status(404).json({ error: "Company info not found" });
        }
    })
);

app.put(
    "/api/company-info",
    handleAsync(async (req, res) => {
        const { title, description, images } = req.body; // 'images' será un array de objetos {id, src, alt}
        // Validaciones básicas
        if (
            title === undefined &&
            description === undefined &&
            images === undefined
        ) {
            return res
                .status(400)
                .json({ error: "No data provided for update" });
        }

        const fieldsToUpdate = [];
        const values = [];
        let paramCount = 1;

        if (title !== undefined) {
            fieldsToUpdate.push(`title = $${paramCount++}`);
            values.push(title);
        }
        if (description !== undefined) {
            fieldsToUpdate.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if (images !== undefined) {
            fieldsToUpdate.push(`images = $${paramCount++}`);
            values.push(JSON.stringify(images)); // Convertir el array de imágenes a un string JSON
        }

        if (fieldsToUpdate.length === 0) {
            return res
                .status(400)
                .json({ error: "No valid fields provided for update" });
        }

        values.push("1"); // Asumiendo que el id de company_info es siempre '1'

        const queryText = `UPDATE company_info SET ${fieldsToUpdate.join(
            ", "
        )} WHERE id = $${paramCount} RETURNING *`;

        const result = await pool.query(queryText, values);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({
                error: "Company info not found to update (id: 1)",
            });
        }
    })
);

// --- Timeline Events ---
app.get(
    "/api/timeline-events",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM timeline_events ORDER BY year ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/timeline-events",
    handleAsync(async (req, res) => {
        const { id, year, title, description } = req.body; // Asumimos que el id también se envía o se genera
        const result = await pool.query(
            "INSERT INTO timeline_events (id, year, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, year, title, description]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/timeline-events/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { year, title, description } = req.body;
        const result = await pool.query(
            "UPDATE timeline_events SET year = $1, title = $2, description = $3 WHERE id = $4 RETURNING *",
            [year, title, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Timeline event not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/timeline-events/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM timeline_events WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Timeline event not found" });
        }
        res.status(204).send();
    })
);

// --- Contact Info --- (Asumiendo múltiples entradas)
app.get(
    "/api/contact-info",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT * FROM contact_info ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);

app.post(
    "/api/contact-info",
    handleAsync(async (req, res) => {
        const { id, icon, text, show_on_mobile } = req.body;
        const result = await pool.query(
            "INSERT INTO contact_info (id, icon, text, show_on_mobile) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, icon, text, show_on_mobile]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.put(
    "/api/contact-info/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { icon, text, show_on_mobile } = req.body;
        const result = await pool.query(
            "UPDATE contact_info SET icon = $1, text = $2, show_on_mobile = $3 WHERE id = $4 RETURNING *",
            [icon, text, show_on_mobile, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Contact info not found" });
        }
        res.json(result.rows[0]);
    })
);

app.delete(
    "/api/contact-info/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM contact_info WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Contact info not found" });
        }
        res.status(204).send();
    })
);

// --- Site Settings (MapLocation, general Logo) ---
// Asumiendo una tabla 'site_settings' con una única fila id='default'
// CREATE TABLE site_settings (id VARCHAR(255) PRIMARY KEY, map_embed_url TEXT, site_logo_url VARCHAR(255));
// INSERT INTO site_settings (id, map_embed_url, site_logo_url) VALUES ('default', '', '');
// Necesitarás crear esta tabla y su archivo .sql (ej. 12_site_settings.sql)

app.get(
    "/api/site-settings",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            "SELECT map_embed_url, site_logo_url FROM site_settings WHERE id = 'default'"
        );
        if (result.rows.length > 0) {
            res.json({
                mapLocation: { embedUrl: result.rows[0].map_embed_url },
                logo: result.rows[0].site_logo_url,
            });
        } else {
            res.status(404).json({ error: "Site settings not found" });
        }
    })
);

app.put(
    "/api/site-settings",
    handleAsync(async (req, res) => {
        const { mapLocation, logo } = req.body; // mapLocation = { embedUrl: '...' }, logo = '...'

        const fieldsToUpdate = [];
        const values = [];
        let paramCount = 1;

        if (mapLocation && mapLocation.embedUrl !== undefined) {
            fieldsToUpdate.push(`map_embed_url = $${paramCount++}`);
            values.push(mapLocation.embedUrl);
        }
        if (logo !== undefined) {
            fieldsToUpdate.push(`site_logo_url = $${paramCount++}`);
            values.push(logo);
        }

        if (fieldsToUpdate.length === 0) {
            return res
                .status(400)
                .json({ error: "No valid fields provided for update" });
        }

        values.push("default"); // WHERE id = 'default'

        const queryText = `UPDATE site_settings SET ${fieldsToUpdate.join(
            ", "
        )} WHERE id = $${paramCount} RETURNING map_embed_url, site_logo_url`;

        const result = await pool.query(queryText, values);
        if (result.rows.length > 0) {
            res.json({
                mapLocation: { embedUrl: result.rows[0].map_embed_url },
                logo: result.rows[0].site_logo_url,
            });
        } else {
            res.status(404).json({
                error: "Site settings not found to update (id: default)",
            });
        }
    })
);

// --- Users (Admin) ---
// GET para listar usuarios (ejemplo simple, sin contraseñas)
app.get(
    "/api/users",
    handleAsync(async (req, res) => {
        // Asegurar que esta ruta esté protegida y solo accesible por administradores
        const result = await pool.query(
            "SELECT id, username, name, email, created_at FROM users ORDER BY id ASC"
        );
        res.json(result.rows);
    })
);
// NOTA: CRUD completo para usuarios (especialmente POST para crear con hashing de contraseña,
// PUT para actualizar, DELETE) requiere más lógica de seguridad y no se incluye aquí por brevedad,
// pero seguiría un patrón similar.

// Server Port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT} and serving static files from 'public' directory`
    );
});
