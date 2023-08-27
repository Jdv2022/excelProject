<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null) {
        // Set CORS headers for allowed origins, methods, and headers
        $allowedOrigins = array('http://localhost:3000', 'http://localhost:3001');
        $origin = $_SERVER['HTTP_ORIGIN'];

        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, PUT, DELETE');
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action required for the after filter
    }
}
