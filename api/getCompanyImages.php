<?php
require_once 'db_connection.php';
$conn = getDbConnection();
$sql = "SELECT id, image_url, alt_text, order_index FROM company_images ORDER BY order_index ASC";
$result = $conn->query($sql);
$images = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $images[] = $row;
    }
}
$conn->close();
echo json_encode($images);
?>