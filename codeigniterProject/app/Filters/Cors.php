<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null){
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Headers: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, PUT, DELETE');

        // If it's an OPTIONS request, we will just return an empty response with the appropriate headers
        if ($request->getMethod() === 'OPTIONS') {
            $response = service('response');
            return $response->setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
                            ->setHeader('Access-Control-Allow-Headers', '*')
                            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
                            ->setStatusCode(200); // Set the appropriate status code for OPTIONS response
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action required for the after filter
    }
}
