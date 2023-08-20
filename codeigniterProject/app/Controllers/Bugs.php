<?php

namespace App\Controllers;
use App\Models\Bug;
use CodeIgniter\Session\SessionInterface;
use Config\Services;

class Bugs extends BaseController{
    public function create(){
        $model = new Bug();
        $name = $this->request->getPost('name');
        $bug = $this->request->getPost('bug');
        $message = $this->request->getPost('message');
        $rules = [
            'name' => 'required',
            'bug' => 'required',
            'message' => 'required',
        ];
        if (!$this->validate($rules)) {
            $validationErrors = $this->validator->getErrors();
            return $this->response->setJSON(['response' => $validationErrors]);
        }
        $data = [
            'name' => $name,
            'bug' => $bug,
            'read' => 0,
            'messages' => $message,
            'created@' => date('Y-m-d H:i:s'),
            'updated@' => date('Y-m-d H:i:s'),
        ];

        $inserted = $model->insert($data);

        if ($inserted) {
            return $this->response->setJSON(['response' => ['success' => 'Sent!']]);
        } 
        else {
            return $this->response->setJSON(['response' => false]);
        }
    }
}
