<?php
require_once 'db_connection.php';

$conn = getDbConnection();

$stats = [];
$tables_to_count = [
    'products' => 'total_products',
    'categories' => 'total_categories',
    'banners' => 'total_banners',
    'timeline_events' => 'total_events'
];

foreach ($tables_to_count as $table_name => $key_name) {
    $result = $conn->query("SELECT COUNT(*) as count FROM {$table_name}");
    $row = $result->fetch_assoc();
    $stats[$key_name] = $row['count'];
}

$conn->close();

echo json_encode($stats);
?>