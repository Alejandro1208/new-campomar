<?php
require_once 'db_connection.php';

// --- Directorio de Subida ---
// La ruta se calcula desde la raíz del servidor, no desde la web
$upload_dir = '/home/ale287/public_html/uploads/products/';
// La URL base para guardar en la base de datos
$base_url = '/uploads/products/';

// --- Validar que la petición sea POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// --- Validar los datos del formulario ---
if (!isset($_POST['name']) || !isset($_POST['description']) || !isset($_POST['category_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos del producto.']);
    exit();
}

// --- Validar el archivo de imagen ---
if (!isset($_FILES['logo']) || $_FILES['logo']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Se requiere un archivo de imagen para el logo.']);
    exit();
}

// --- Procesar la subida de la imagen ---
$file_tmp_path = $_FILES['logo']['tmp_name'];
$file_name = $_FILES['logo']['name'];
$file_size = $_FILES['logo']['size'];
$file_type = $_FILES['logo']['type'];
$file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

$allowed_extensions = ['jpg', 'jpeg', 'png'];
if (!in_array($file_extension, $allowed_extensions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Extensión de archivo no permitida. Solo JPG, JPEG, PNG.']);
    exit();
}

// Crear un nombre de archivo único para evitar sobreescribir
$new_file_name = uniqid('', true) . '.' . $file_extension;
$dest_path = $upload_dir . $new_file_name;

if (!move_uploaded_file($file_tmp_path, $dest_path)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al mover el archivo subido.']);
    exit();
}

// --- Insertar los datos en la base de datos ---
$name = $_POST['name'];
$description = $_POST['description'];
$category_id = $_POST['category_id'];
$logo_image_url = $base_url . $new_file_name; // Guardamos la ruta relativa

$conn = getDbConnection();

$stmt = $conn->prepare("INSERT INTO products (name, description, category_id, logo_image_url) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssis", $name, $description, $category_id, $logo_image_url);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Producto creado con éxito.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el producto en la base de datos.']);
}

$stmt->close();
$conn->close();
?>