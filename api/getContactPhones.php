<?php
require_once 'db_connection.php';
$conn = getDbConnection();
$sql = "SELECT id, display_number, whatsapp_number FROM contact_phones ORDER BY order_index ASC";
$result = $conn->query($sql);
$phones = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $phones[] = $row;
    }
}
$conn->close();
echo json_encode($phones);
?>