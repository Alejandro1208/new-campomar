<?php
// Incluir el archivo de conexión a la base de datos
require_once 'db_connection.php';

// Obtener la conexión a la base de datos
$conn = getDbConnection();

// Preparar la consulta SQL para obtener todas las categorías
$sql = "SELECT id, name FROM categories ORDER BY name";

$result = $conn->query($sql);

$categories = [];

if ($result && $result->num_rows > 0) {
    // Obtener los resultados como un array asociativo
    while($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
}

// Cerrar la conexión a la base de datos
$conn->close();

// Devolver los resultados en formato JSON
echo json_encode($categories);
?>
