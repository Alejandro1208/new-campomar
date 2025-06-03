import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

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

const UPLOAD_DIR_BANNER = "public/uploads/banner_images";
const absoluteUploadDirBanner = path.join(__dirname, UPLOAD_DIR_BANNER);
fs.mkdirSync(absoluteUploadDirBanner, { recursive: true });

const UPLOAD_DIR_SITE_LOGO = "public/uploads/site_logo";
const absoluteUploadDirSiteLogo = path.join(__dirname, UPLOAD_DIR_SITE_LOGO);
fs.mkdirSync(absoluteUploadDirSiteLogo, { recursive: true });


const siteLogoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, absoluteUploadDirSiteLogo);
    },
    filename: function (req, file, cb) {
        // Usar un nombre de archivo más predecible o mantener el original con un sufijo
        // Para el logo del sitio, podrías querer un nombre fijo como 'site-logo' y simplemente sobrescribirlo,
        // o añadir un timestamp para versionado. Por simplicidad, usemos un sufijo único.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, "site-logo-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const siteLogoUpload = multer({
    storage: siteLogoStorage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Límite de 1MB para el logo del sitio (ajusta)
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|webp|svg/; // SVG también es común para logos
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Tipo de archivo no permitido para el logo. Solo se permiten JPEG, JPG, PNG, WEBP, SVG."));
    },
});



const bannerImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, absoluteUploadDirBanner);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "banner-" + uniqueSuffix + path.extname(file.originalname)); // Prefijo 'banner-'
    },
});

const bannerImageUpload = multer({
    storage: bannerImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB (ajusta si es necesario)
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Tipo de archivo no permitido para imagen de banner. Solo se permiten JPEG, JPG, PNG, WEBP."));
    },
});

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

app.post("/api/products", handleAsync(async (req: Request, res: Response) => {
    const { name, description, category_id, logo } = req.body;
    const newId = uuidv4(); // <--- 2. Genera un nuevo ID único

    // Aquí deberías añadir validación para los datos de entrada, por ejemplo:
    if (!name || !category_id) { // Asumiendo que name y category_id son obligatorios
        return res.status(400).json({ error: 'Nombre y ID de categoría son obligatorios.' });
    }

    const result = await pool.query(
        // <--- 3. Añade 'id' a la lista de columnas y $5 a los valores
        "INSERT INTO products (id, name, description, category_id, logo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        // <--- 4. Pasa newId como el primer valor
        [newId, name, description, category_id, logo]
    );
    res.status(201).json(result.rows[0]);
}));

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

app.post("/api/social-media", handleAsync(async (req: Request, res: Response) => {
    const { name, icon, url } = req.body;
    const newId = uuidv4(); // Genera un nuevo ID

    if (!name || !icon || !url) { // Validación básica
        return res.status(400).json({ error: "Nombre, ícono y URL son obligatorios." });
    }

    const result = await pool.query(
        "INSERT INTO social_media (id, name, icon, url) VALUES ($1, $2, $3, $4) RETURNING *", // Añade 'id' a las columnas
        [newId, name, icon, url] // Pasa el newId
    );
    res.status(201).json(result.rows[0]);
}));

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
    handleAsync(async (req: Request, res: Response) => {
        const { number, label } = req.body;
        const newId = uuidv4(); // <--- 1. Genera un nuevo ID único

        // Validación básica (opcional pero recomendada)
        if (!number) {
            return res.status(400).json({ error: 'El campo "number" es obligatorio.' });
        }

        const result = await pool.query(
            // <--- 2. Añade 'id' a la lista de columnas y $3 a los valores
            "INSERT INTO phone_numbers (id, number, label) VALUES ($1, $2, $3) RETURNING *",
            // <--- 3. Pasa newId como el primer valor
            [newId, number, label]
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
app.post(
    "/api/upload/banner-image",
    bannerImageUpload.single("bannerImage"), // Espera un campo 'bannerImage'
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            res.status(400).json({ error: "No se subió ninguna imagen para el banner." });
            return;
        }
        try {
            const relativePath = path
                .join("uploads/banner_images", req.file!.filename)
                .replace(/\\/g, "/");
            const publicUrl = `${req.protocol}://${req.get("host")}/${relativePath}`;
            res.status(201).json({
                message: "Imagen de banner subida exitosamente!",
                filePath: `/${relativePath}`,
                publicUrl: publicUrl,
            });
        } catch (processingError) {
            next(processingError);
        }
    },
    (error: any, req: Request, res: Response, next: NextFunction): void => { // Manejador de errores de Multer
        if (res.headersSent) { return next(error); }
        if (error instanceof multer.MulterError) {
            res.status(400).json({ error: `Error de Multer (banner image): ${error.message}` });
            return;
        } else if (error && error.message) {
            res.status(400).json({ error: error.message });
            return;
        } else if (error) {
            console.error("Error inesperado durante la subida de imagen de banner:", error);
            res.status(500).json({ error: "Error interno procesando la imagen del banner." });
            return;
        }
        next();
    }
);

// --- Endpoints CRUD para Banner Slides ---
// GET /api/banner-slides (Leer todos los slides) - Ya lo tienes, asegúrate que seleccione todos los campos nuevos
app.get("/api/banner-slides", handleAsync(async (req, res) => {
    const result = await pool.query("SELECT * FROM banner_slides ORDER BY id ASC"); // O el orden que prefieras
    res.json(result.rows);
}));

// POST /api/banner-slides (Crear un nuevo slide)
app.post("/api/banner-slides", handleAsync(async (req, res) => {
    const { image, title, subtitle, cta_text, cta_url, cta_is_visible } = req.body;
    const newId = uuidv4(); // Generar ID para el nuevo slide

    if (!image || !title) { // Validación básica
        return res.status(400).json({ error: "La imagen y el título son obligatorios para un slide." });
    }

    const result = await pool.query(
        "INSERT INTO banner_slides (id, image, title, subtitle, cta_text, cta_url, cta_is_visible) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [newId, image, title, subtitle, cta_text, cta_url, cta_is_visible === undefined ? false : cta_is_visible]
    );
    res.status(201).json(result.rows[0]);
}));

// PUT /api/banner-slides/:id (Actualizar un slide existente)
app.put("/api/banner-slides/:id", handleAsync(async (req, res) => {
    const { id } = req.params;
    const { image, title, subtitle, cta_text, cta_url, cta_is_visible } = req.body;

    // Aquí podrías construir una query dinámica si solo quieres actualizar los campos que se envían,
    // o simplemente actualizar todos los campos permitidos.
    // Por simplicidad, actualizaremos todos los campos que podrían venir.
    if (image === undefined && title === undefined && subtitle === undefined && cta_text === undefined && cta_url === undefined && cta_is_visible === undefined) {
        return res.status(400).json({ error: "No data provided for update." });
    }

    // Lógica para construir la query de actualización dinámicamente (opcional pero más flexible)
    const fieldsToUpdate = [];
    const values = [];
    let paramCount = 1;

    if (image !== undefined) { fieldsToUpdate.push(`image = $${paramCount++}`); values.push(image); }
    if (title !== undefined) { fieldsToUpdate.push(`title = $${paramCount++}`); values.push(title); }
    if (subtitle !== undefined) { fieldsToUpdate.push(`subtitle = $${paramCount++}`); values.push(subtitle); }
    if (cta_text !== undefined) { fieldsToUpdate.push(`cta_text = $${paramCount++}`); values.push(cta_text); }
    if (cta_url !== undefined) { fieldsToUpdate.push(`cta_url = $${paramCount++}`); values.push(cta_url); }
    if (cta_is_visible !== undefined) { fieldsToUpdate.push(`cta_is_visible = $${paramCount++}`); values.push(cta_is_visible); }

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: "No valid fields to update." });
    }

    values.push(id); // Para la cláusula WHERE id = $N
    const queryText = `UPDATE banner_slides SET ${fieldsToUpdate.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Banner slide not found" });
    }
    res.json(result.rows[0]);
}));

// DELETE /api/banner-slides/:id (Eliminar un slide)
app.delete("/api/banner-slides/:id", handleAsync(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM banner_slides WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Banner slide not found" });
    }
    // Opcional: Aquí también podrías querer eliminar el archivo de imagen del servidor si ya no se usa en ningún otro slide.
    // Esto requeriría lógica adicional para obtener el `image_path` de result.rows[0] y usar fs.unlink.
    res.status(204).send();
}));

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

app.put("/api/menu-items/:id", handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;

    if (text === undefined || typeof text !== 'string') {
        return res.status(400).json({ error: "El campo 'text' es obligatorio y debe ser un string." });
    }

    const result = await pool.query(
        "UPDATE menu_items SET text = $1 WHERE id = $2 RETURNING *",
        [text, id]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(result.rows[0]);
}));

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

app.put(
    "/api/timeline-events/:id",
    handleAsync(async (req, res) => {
        const { id } = req.params;
        const { year, title, description } = req.body;

        // Construir la query de actualización dinámicamente
        const fieldsToUpdate = [];
        const values = [];
        let paramCount = 1;

        if (year !== undefined) { fieldsToUpdate.push(`year = $${paramCount++}`); values.push(year); }
        if (title !== undefined) { fieldsToUpdate.push(`title = $${paramCount++}`); values.push(title); }
        if (description !== undefined) { fieldsToUpdate.push(`description = $${paramCount++}`); values.push(description); }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: "No fields to update provided." });
        }

        values.push(id); // Para la cláusula WHERE
        const queryText = `UPDATE timeline_events SET ${fieldsToUpdate.join(", ")} WHERE id = $${paramCount} RETURNING *`;

        const result = await pool.query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Timeline event not found" });
        }
        res.json(result.rows[0]);
    })
);

// Endpoint para CREAR un evento de la línea de tiempo (si lo necesitas en el futuro)
app.post(
    "/api/timeline-events",
    handleAsync(async (req, res) => {
        const { year, title, description } = req.body;
        const newId = uuidv4(); // Generar ID único

        if (!year || !title) {
            return res.status(400).json({ error: "Year and title are required." });
        }
        const result = await pool.query(
            "INSERT INTO timeline_events (id, year, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
            [newId, year, title, description]
        );
        res.status(201).json(result.rows[0]);
    })
);

app.post("/api/contact-info", handleAsync(async (req: Request, res: Response) => {
    const { icon, text, show_on_mobile, is_active } = req.body;
    const newId = uuidv4();

    // Validación básica
    if (!icon || !text) {
        return res.status(400).json({ error: "Icono y texto son obligatorios." });
    }

    const result = await pool.query(
        "INSERT INTO contact_info (id, icon, text, show_on_mobile, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [newId, icon, text, show_on_mobile === undefined ? true : show_on_mobile, is_active === undefined ? true : is_active]
    );
    res.status(201).json(result.rows[0]);
}));

// En src/server/index.ts
app.put("/api/contact-info/:id", handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { icon, text, show_on_mobile, is_active } = req.body;

    if (icon === undefined && text === undefined && show_on_mobile === undefined && is_active === undefined) {
        return res.status(400).json({ error: "No hay datos para actualizar." });
    }
    const result = await pool.query(
        "UPDATE contact_info SET icon = $1, text = $2, show_on_mobile = $3, is_active = $4 WHERE id = $5 RETURNING *",
        [icon, text, show_on_mobile, is_active, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Ítem de contacto no encontrado." });
    }
    res.json(result.rows[0]);
}));
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

app.post("/api/contact-info", handleAsync(async (req, res) => {
    const { id, icon, text, show_on_mobile, is_active } = req.body; // Añadir is_active
    const result = await pool.query(
        "INSERT INTO contact_info (id, icon, text, show_on_mobile, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [id, icon, text, show_on_mobile, (is_active === undefined) ? true : is_active] // Default a true si no se provee
    );
    res.status(201).json(result.rows[0]);
}));

// PUT /api/contact-info/:id
app.put("/api/contact-info/:id", handleAsync(async (req, res) => {
    const { id } = req.params;
    const { icon, text, show_on_mobile, is_active } = req.body; // Añadir is_active
    const result = await pool.query(
        "UPDATE contact_info SET icon = $1, text = $2, show_on_mobile = $3, is_active = $4 WHERE id = $5 RETURNING *",
        [icon, text, show_on_mobile, is_active, id]
    );
    res.json(result.rows[0]);
}));

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

app.get(
    "/api/site-settings",
    handleAsync(async (req, res) => {
        const result = await pool.query(
            // SELECCIONA LOS NUEVOS CAMPOS
            "SELECT map_embed_url, site_logo_url, footer_short_description, footer_copyright FROM site_settings WHERE id = 'default'"
        );
        if (result.rows.length > 0) {
            res.json({
                mapLocation: { embedUrl: result.rows[0].map_embed_url },
                logo: result.rows[0].site_logo_url,
                footerShortDescription: result.rows[0].footer_short_description, // DEVUELVE ESTE CAMPO
                footerCopyright: result.rows[0].footer_copyright            // DEVUELVE ESTE CAMPO
            });
        } else {
            // Considera devolver valores por defecto si no se encuentran settings
            res.status(404).json({ 
                error: "Site settings not found",
                mapLocation: { embedUrl: '' },
                logo: '',
                footerShortDescription: '',
                footerCopyright: ''
            });
        }
    })
);

app.put("/api/site-settings", handleAsync(async (req: Request, res: Response) => {
    const { mapLocation, logo, footerShortDescription, footerCopyright } = req.body; // Ya los recibes

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
    // AÑADE LOS NUEVOS CAMPOS A LA ACTUALIZACIÓN
    if (footerShortDescription !== undefined) {
        fieldsToUpdate.push(`footer_short_description = $${paramCount++}`);
        values.push(footerShortDescription);
    }
    if (footerCopyright !== undefined) {
        fieldsToUpdate.push(`footer_copyright = $${paramCount++}`);
        values.push(footerCopyright);
    }

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: "No valid fields provided for update" });
    }

    values.push("default"); // WHERE id = 'default'

    // ASEGÚRATE DE QUE RETURNING DEVUELVA TODOS LOS CAMPOS
    const queryText = `UPDATE site_settings SET ${fieldsToUpdate.join(", ")} WHERE id = $${paramCount} RETURNING map_embed_url, site_logo_url, footer_short_description, footer_copyright`;

    const result = await pool.query(queryText, values);
    if (result.rows.length > 0) {
        res.json({
            mapLocation: { embedUrl: result.rows[0].map_embed_url },
            logo: result.rows[0].site_logo_url,
            footerShortDescription: result.rows[0].footer_short_description, // DEVUELVE EL CAMPO ACTUALIZADO
            footerCopyright: result.rows[0].footer_copyright            // DEVUELVE EL CAMPO ACTUALIZADO
        });
    } else {
        res.status(404).json({ error: "Site settings not found to update (id: default)" });
    }
}));

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


// --- Nuevo Endpoint para Subir el LOGO DEL SITIO ---
app.post(
    "/api/upload/site-logo",
    siteLogoUpload.single("siteLogo"), // Espera un campo 'siteLogo'
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            res.status(400).json({ error: "No se subió ningún archivo para el logo." });
            return;
        }
        try {
            const relativePath = path
                .join("uploads/site_logo", req.file!.filename)
                .replace(/\\/g, "/");
            const publicUrl = `<span class="math-inline">\{req\.protocol\}\://</span>{req.get("host")}/${relativePath}`;
            res.status(201).json({
                message: "Logo del sitio subido exitosamente!",
                filePath: `/${relativePath}`, // Esta es la ruta que guardarás
                publicUrl: publicUrl,
            });
        } catch (processingError) {
            next(processingError);
        }
    },
    // Middleware de manejo de errores para esta ruta
    (error: any, req: Request, res: Response, next: NextFunction): void => {
        if (res.headersSent) { return next(error); }
        if (error instanceof multer.MulterError) {
            res.status(400).json({ error: `Error de Multer (site logo): ${error.message}` });
            return;
        } else if (error && error.message) {
            res.status(400).json({ error: error.message });
            return;
        } else if (error) {
            console.error("Error inesperado durante la subida del logo del sitio:", error);
            res.status(500).json({ error: "Error interno procesando el logo del sitio." });
            return;
        }
        next();
    }
);

