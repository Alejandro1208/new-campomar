<?php
require_once 'db_connection.php';

$conn = getDbConnection();

// Consulta SQL que une las tablas products y categories
$sql = "
    SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.logo_image_url, 
        p.category_id,
        c.name AS category_name 
    FROM 
        products p
    LEFT JOIN 
        categories c ON p.category_id = c.id
    ORDER BY 
        p.name
";

$result = $conn->query($sql);

$products = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Creamos un objeto 'category' dentro de cada producto para que coincida con la estructura que espera el frontend
        $row['category'] = [
            'id' => $row['category_id'],
            'name' => $row['category_name']
        ];
        // Convertimos los tipos de datos si es necesario para que coincidan con TypeScript
        $row['id'] = (string)$row['id'];
        $row['category_id'] = (string)$row['category_id'];

        // Eliminamos la clave duplicada
        unset($row['category_name']);

        $products[] = $row;
    }
}

$conn->close();

echo json_encode($products);
?>