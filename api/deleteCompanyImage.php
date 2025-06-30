<?php
require_once 'db_connection.php';
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->id)) { http_response_code(400); exit(); }

$id = $data->id;
$conn = getDbConnection();

// Borrar archivo físico
$stmt_select = $conn->prepare("SELECT image_url FROM company_images WHERE id = ?");
$stmt_select->bind_param("i", $id);
$stmt_select->execute();
$result = $stmt_select->get_result();
if ($result->num_rows === 1) {
    $image = $result->fetch_assoc();
    $full_path = '/home/ale287/public_html' . $image['image_url'];
    if (file_exists($full_path)) { unlink($full_path); }
}
$stmt_select->close();

// Borrar registro de la DB
$stmt_delete = $conn->prepare("DELETE FROM company_images WHERE id = ?");
$stmt_delete->bind_param("i", $id);

if ($stmt_delete->execute()) {
    http_response_code(200); echo json_encode(['success' => true]);
} else {
    http_response_code(500);
}
$stmt_delete->close();
$conn->close();
?>