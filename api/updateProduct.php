<?php
require_once 'db_connection.php';

// --- Directorio de Subida ---
$upload_dir = '/home/ale287/public_html/uploads/products/';
$base_url = '/uploads/products/';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// --- Validar los datos del formulario ---
if (!isset($_POST['id']) ||!isset($_POST['name']) || !isset($_POST['description']) || !isset($_POST['category_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos del producto.']);
    exit();
}

$id = $_POST['id'];
$name = $_POST['name'];
$description = $_POST['description'];
$category_id = $_POST['category_id'];

$conn = getDbConnection();
$logo_image_url = null;

// --- Manejar la subida de una NUEVA imagen (si se envió una) ---
if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
    // Borrar la imagen antigua primero
    $stmt_select = $conn->prepare("SELECT logo_image_url FROM products WHERE id = ?");
    $stmt_select->bind_param("i", $id);
    $stmt_select->execute();
    $result = $stmt_select->get_result();
    if ($result->num_rows === 1) {
        $product = $result->fetch_assoc();
        $old_image_path = '/home/ale287/public_html' . $product['logo_image_url'];
        if (file_exists($old_image_path)) {
            unlink($old_image_path);
        }
    }
    $stmt_select->close();

    // Subir la nueva imagen
    $file_tmp_path = $_FILES['logo']['tmp_name'];
    $file_name = $_FILES['logo']['name'];
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $new_file_name = uniqid('', true) . '.' . $file_extension;
    $dest_path = $upload_dir . $new_file_name;

    if (move_uploaded_file($file_tmp_path, $dest_path)) {
        $logo_image_url = $base_url . $new_file_name;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al subir la nueva imagen.']);
        exit();
    }
}

// --- Actualizar la base de datos ---
if ($logo_image_url) {
    // Si se subió una nueva imagen, actualizamos también la URL
    $stmt = $conn->prepare("UPDATE products SET name = ?, description = ?, category_id = ?, logo_image_url = ? WHERE id = ?");
    $stmt->bind_param("ssisi", $name, $description, $category_id, $logo_image_url, $id);
} else {
    // Si no se subió una imagen nueva, solo actualizamos los datos de texto
    $stmt = $conn->prepare("UPDATE products SET name = ?, description = ?, category_id = ? WHERE id = ?");
    $stmt->bind_param("ssii", $name, $description, $category_id, $id);
}

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Producto actualizado con éxito.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar el producto en la base de datos.']);
}

$stmt->close();
$conn->close();
?>