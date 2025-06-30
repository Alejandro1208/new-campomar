<?php
require_once 'db_connection.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->year) || !isset($data->title)) { http_response_code(400); exit(); }

$id = $data->id;
$year = $data->year;
$title = trim($data->title);
$conn = getDbConnection();
$stmt = $conn->prepare("UPDATE timeline_events SET year = ?, title = ? WHERE id = ?");
$stmt->bind_param("isi", $year, $title, $id);

if ($stmt->execute()) {
    http_response_code(200); echo json_encode(['success' => true]);
} else {
    http_response_code(500);
}
$stmt->close();
$conn->close();
?>