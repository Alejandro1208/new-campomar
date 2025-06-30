<?php
require_once 'db_connection.php';
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->year) || !isset($data->title)) { http_response_code(400); exit(); }

$year = $data->year;
$title = trim($data->title);
$conn = getDbConnection();
$stmt = $conn->prepare("INSERT INTO timeline_events (year, title) VALUES (?, ?)");
$stmt->bind_param("is", $year, $title);

if ($stmt->execute()) {
    http_response_code(201); echo json_encode(['success' => true]);
} else {
    http_response_code(500);
}
$stmt->close();
$conn->close();
?>