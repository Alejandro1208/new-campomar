<?php
require_once 'db_connection.php';

$upload_dir = '/home/ale287/public_html/uploads/banners/';
$base_url = '/uploads/banners/';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit(); }
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Se requiere un archivo de imagen.']);
    exit();
}

// Procesar subida de imagen (igual que antes)
$file_tmp_path = $_FILES['image']['tmp_name'];
$file_name = $_FILES['image']['name'];
$file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
$new_file_name = uniqid('', true) . '.' . $file_extension;
$dest_path = $upload_dir . $new_file_name;

if (!move_uploaded_file($file_tmp_path, $dest_path)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al mover el archivo subido.']);
    exit();
}

// ACTUALIZACIÓN: Recoger los nuevos campos del formulario
$image_url = $base_url . $new_file_name;
$alt_text = $_POST['alt_text'] ?? 'Banner image';
$headline = $_POST['headline'] ?? '';
$subheadline = $_POST['subheadline'] ?? '';
$cta_text = $_POST['cta_text'] ?? '';
$cta_link = $_POST['cta_link'] ?? '#';

$conn = getDbConnection();
// ACTUALIZACIÓN: Añadir los nuevos campos a la consulta INSERT
$stmt = $conn->prepare("INSERT INTO banners (image_url, alt_text, headline, subheadline, cta_text, cta_link) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $image_url, $alt_text, $headline, $subheadline, $cta_text, $cta_link);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el banner.']);
}

$stmt->close();
$conn->close();
?>