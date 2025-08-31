<?php
// Simple PHP proxy for Zapier webhooks to bypass CORS issues
// Place this file on your web server and call it instead of the Zapier webhook directly

// Enable CORS for your domain
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Your Zapier webhook URL
$zapier_webhook_url = 'https://hooks.zapier.com/hooks/catch/22469845/u4jrg6c/';

// Get the request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// If no JSON data, try form data
if (empty($data)) {
    $data = $_POST;
}

// Add server-side timestamp if not provided
if (!isset($data['timestamp'])) {
    $data['timestamp'] = date('c'); // ISO 8601 format
}

// Add source information
$data['proxy_source'] = 'PHP Webhook Proxy';
$data['user_ip'] = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Forward to Zapier
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $zapier_webhook_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'User-Agent: WebhookProxy/1.0'
    ],
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

// Return response to client
http_response_code($http_code);
header('Content-Type: application/json');

if ($response === false) {
    echo json_encode([
        'success' => false,
        'error' => 'Failed to forward to Zapier webhook'
    ]);
} else {
    echo $response;
}
?>