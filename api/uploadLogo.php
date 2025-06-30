<?php
require_once 'db_connection.php';

$upload_dir = '/home/ale287/public_html/uploads/logo/';
$base_url = '/uploads/logo/';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit(); }
if (!isset($_FILES['logo']) || $_FILES['logo']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Se requiere un archivo de imagen.']);
    exit();
}

$conn = getDbConnection();

// Borrar el logo antiguo del servidor
$result = $conn->query("SELECT value FROM site_settings WHERE `key` = 'site_logo_url'");
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $old_logo_path = '/home/ale287/public_html' . $row['value'];
    if (!empty($row['value']) && file_exists($old_logo_path)) {
        unlink($old_logo_path);
    }
}

// Subir el nuevo logo
$file_tmp_path = $_FILES['logo']['tmp_name'];
$file_name = $_FILES['logo']['name'];
$file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
$new_file_name = 'logo.' . $file_extension; // Usamos un nombre fijo para el logo
$dest_path = $upload_dir . $new_file_name;

if (!move_uploaded_file($file_tmp_path, $dest_path)) {
    http_response_code(500); echo json_encode(['error' => 'Error al mover el archivo subido.']); exit();
}

// Actualizar la ruta en la base de datos
$logo_url = $base_url . $new_file_name;
$stmt = $conn->prepare("UPDATE site_settings SET value = ? WHERE `key` = 'site_logo_url'");
$stmt->bind_param("s", $logo_url);

if ($stmt->execute()) {
    http_response_code(200); echo json_encode(['success' => true, 'new_url' => $logo_url]);
} else {
    http_response_code(500); echo json_encode(['error' => 'Error al guardar la ruta del logo.']);
}

$stmt->close();
$conn->close();
?>