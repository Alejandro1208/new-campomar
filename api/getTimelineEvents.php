<?php
require_once 'db_connection.php';

$conn = getDbConnection();

// Obtener todos los eventos ordenados por 'order_index'
$sql = "SELECT id, year, title, order_index FROM timeline_events ORDER BY order_index ASC";

$result = $conn->query($sql);

$events = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
}

$conn->close();

echo json_encode($events);
?>