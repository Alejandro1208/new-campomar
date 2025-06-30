<?php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(['error' => 'El ID del producto es requerido.']);
    exit();
}

$id = $data->id;
$conn = getDbConnection();

// --- Primero, obtener la ruta de la imagen para poder borrarla ---
$stmt_select = $conn->prepare("SELECT logo_image_url FROM products WHERE id = ?");
$stmt_select->bind_param("i", $id);
$stmt_select->execute();
$result = $stmt_select->get_result();
if ($result->num_rows === 1) {
    $product = $result->fetch_assoc();
    $image_path = $product['logo_image_url'];

    // Construir la ruta completa del archivo en el servidor
    // OJO: La ruta debe ser la del sistema de archivos, no la URL
    $full_path = '/home/ale287/public_html' . $image_path;

    // Borrar el archivo de imagen si existe
    if (file_exists($full_path)) {
        unlink($full_path);
    }
}
$stmt_select->close();


// --- Segundo, borrar el producto de la base de datos ---
$stmt_delete = $conn->prepare("DELETE FROM products WHERE id = ?");
$stmt_delete->bind_param("i", $id);

if ($stmt_delete->execute()) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Producto eliminado con éxito.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al eliminar el producto de la base de datos.']);
}

$stmt_delete->close();
$conn->close();
?>