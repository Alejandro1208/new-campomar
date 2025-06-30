<?php
// Iniciar la sesión de PHP. Es crucial que esto esté al principio.
session_start();

// Incluir nuestro archivo de conexión
require_once 'db_connection.php';

// Leer los datos JSON que envía el frontend
$data = json_decode(file_get_contents("php://input"));

// Verificar que recibimos email y contraseña
if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Email y contraseña son requeridos.']);
    exit();
}

$email = $data->email;
$password = $data->password;

$conn = getDbConnection();

// Preparar la consulta para evitar inyección SQL
$stmt = $conn->prepare("SELECT id, email, password FROM admins WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $admin = $result->fetch_assoc();

    // Verificar la contraseña encriptada
    // La contraseña en la base de datos para 'admin123' es '$2y$10$fG3d.T/F.tA3i.w5sE3C5uB3wG2k4H7n8iJ9k0L1mN2oP3q4R5s6'
    // password_verify se encargará de compararlas
    if (password_verify($password, $admin['password'])) {
        // ¡Credenciales correctas!
        // Guardar información en la sesión del servidor
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_email'] = $admin['email'];

        http_response_code(200); // OK
        echo json_encode([
            'success' => true,
            'message' => 'Login exitoso.',
            'user' => [
                'id' => $admin['id'],
                'email' => $admin['email']
            ]
        ]);
    } else {
        // Contraseña incorrecta
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'Credenciales incorrectas.']);
    }
} else {
    // Usuario no encontrado
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Credenciales incorrectas.']);
}

$stmt->close();
$conn->close();
?>