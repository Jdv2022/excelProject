<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class CORSController extends Controller
{
    public function handleOptions(){
        $response = service('response');
        return $response->setStatusCode(201); 
    }
    public function handleOptions2(){
        $response = service('response');
        return $response->setStatusCode(201); 
    }
}