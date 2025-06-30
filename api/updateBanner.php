<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Para la actualización, los datos vienen en el body de un POST normal
if (!isset($_POST['id']) || !isset($_POST['headline']) || !isset($_POST['subheadline']) || !isset($_POST['cta_text']) || !isset($_POST['cta_link'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos para actualizar el banner.']);
    exit();
}

$id = $_POST['id'];
$headline = $_POST['headline'];
$subheadline = $_POST['subheadline'];
$cta_text = $_POST['cta_text'];
$cta_link = $_POST['cta_link'];

$conn = getDbConnection();

// Preparamos la consulta para actualizar los campos de texto
$stmt = $conn->prepare("UPDATE banners SET headline = ?, subheadline = ?, cta_text = ?, cta_link = ? WHERE id = ?");
$stmt->bind_param("ssssi", $headline, $subheadline, $cta_text, $cta_link, $id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Banner actualizado con éxito.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar el banner en la base de datos.']);
}

$stmt->close();
$conn->close();
?>