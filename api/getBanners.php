<?php
require_once 'db_connection.php';

$conn = getDbConnection();

// ACTUALIZACIÓN: Añadimos las nuevas columnas a la consulta SELECT
$sql = "SELECT id, image_url, alt_text, order_index, headline, subheadline, cta_text, cta_link 
        FROM banners 
        ORDER BY order_index ASC";

$result = $conn->query($sql);
$banners = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $banners[] = $row;
    }
}

$conn->close();
echo json_encode($banners);
?>