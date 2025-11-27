<?php
// Usamos los namespaces para las clases de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Los archivos de la librería deben ser incluidos
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

// 1. Recolección de datos desde el formulario y seguridad
$nombre = htmlspecialchars($_POST['nombre']);
$correo = htmlspecialchars($_POST['correo']);
$mensaje = htmlspecialchars($_POST['mensaje']);

// 2. Configuración de destinatario (TU EMPRESA)
// Este es el correo de tu empresa, donde se recibirán los mensajes.
$destino_email = "skaiperoficial25@gmail.com"; 

$asunto_empresa = "Nuevo mensaje desde la web: " . $nombre;
$cuerpo_mensaje = "Nombre: $nombre\nCorreo: $correo\nMensaje:\n$mensaje";

// 3. Inicialización de PHPMailer
$mail = new PHPMailer(true);
$mail->setLanguage('es', 'phpmailer/language/phpmailer.lang-es.php'); // Opcional: mensajes de error en español

try {
    // 4. Configuración del servidor SMTP (Usando Gmail)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';     // Servidor SMTP de Gmail
    $mail->SMTPAuth   = true;
    
    // ⚠️ Reemplaza con el correo de Gmail que usaste en el paso 2 para generar la clave
    $mail->Username   = 'skaiperoficial25@gmail.com'; 
    
    // ⚠️ Reemplaza con la CLAVE DE APLICACIÓN de 16 caracteres generada en el paso 2
    $mail->Password   = 'qmdx snfp jvlo xory';   
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Usar SSL
    $mail->Port       = 465;

    // 5. Configuración de remitente y destinatario
    // ⚠️ Reemplaza con el mismo correo del Username de arriba para evitar problemas
    $mail->setFrom('skaiperoficial25@gmail.com', 'Web Skaiper Contacto'); 
    
    $mail->addAddress($destino_email, 'Equipo Skaiper'); // Destinatario (tu empresa)
    $mail->addReplyTo($correo, $nombre); // Permite responder al correo del cliente

    // 6. Contenido del correo
    $mail->isHTML(false); // Enviamos el mensaje como texto plano
    $mail->Subject = $asunto_empresa;
    $mail->Body    = $cuerpo_mensaje;

    // 7. Enviar
    $mail->send();
    echo "Mensaje enviado correctamente";

} catch (Exception $e) {
    // Si hay un error, lo mostramos para depuración
    echo "El mensaje no pudo ser enviado. Mailer Error: {$mail->ErrorInfo}";
}
?>
