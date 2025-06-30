<?php
require_once 'db_connection.php';

$upload_dir = '/home/ale287/public_html/uploads/company/'; // Usaremos una nueva carpeta
$base_url = '/uploads/company/';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit(); }
if (!isset($_FILES['image'])) { http_response_code(400); echo json_encode(['error'=>'Se requiere archivo']); exit(); }

// --- Crear carpeta si no existe ---
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0775, true);
}

// --- Procesar subida ---
$file_tmp_path = $_FILES['image']['tmp_name'];
$file_name = $_FILES['image']['name'];
$file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
$new_file_name = uniqid('', true) . '.' . $file_extension;
$dest_path = $upload_dir . $new_file_name;

if (!move_uploaded_file($file_tmp_path, $dest_path)) { http_response_code(500); echo json_encode(['error'=>'Error al mover archivo']); exit(); }

// --- Insertar en DB ---
$alt_text = $_POST['alt_text'] ?? 'Imagen de la empresa';
$image_url = $base_url . $new_file_name;

$conn = getDbConnection();
$stmt = $conn->prepare("INSERT INTO company_images (image_url, alt_text) VALUES (?, ?)");
$stmt->bind_param("ss", $image_url, $alt_text);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
}
$stmt->close();
$conn->close();
?>