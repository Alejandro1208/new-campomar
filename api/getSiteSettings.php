<?php
require_once 'db_connection.php';

$conn = getDbConnection();

$sql = "SELECT `key`, `value` FROM site_settings";
$result = $conn->query($sql);

$settings = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $settings[$row['key']] = $row['value'];
    }
}

$conn->close();

echo json_encode($settings);
?>