<?php

namespace App\Controllers;
use App\Models\Message;
use App\Models\Admin;
use CodeIgniter\Session\SessionInterface;
use Config\Services;

class Messages extends BaseController{
    public function index(){
        return view('index');
    }
    public function sessionG(){
        $model = new Admin();
        $status = $model->where('username', 'admin')->findAll();
        if($status){
            foreach ($status as $stats){
                if($stats['status'] == 1){
                    return $this->response->setJSON(['response' => true]);
                }
            }
            return $this->response->setJSON(['response' => false]);
        }
        else{
            return $this->response->setJSON(['response' => false]);
        }
    }
    public function create(){
        $model = new Message();
        $name = $this->request->getPost('name');
        $title = $this->request->getPost('title');
        $message = $this->request->getPost('message');
        $rules = [
            'name' => 'required',
            'title' => 'required',
            'message' => 'required',
        ];
        if (!$this->validate($rules)) {
            $validationErrors = $this->validator->getErrors();
            return $this->response->setJSON(['response' => $validationErrors]);
        }
        $data = [
            'name' => $name,
            'title' => $title,
            'read' => 0,
            'message' => $message,
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
    public function getAll(){
        $model = new Message();
        $get = $model->orderBy('id', 'desc')->findAll();
        if ($get) {
            return $this->response->setJSON(['response' => $get]);
        } 
        else {
            return $this->response->setJSON(['response' => null]);
        }
    }
    public function deleteAdmin(){
        $id = $this->request->getJSON(true);
        $model = new Message();
        $deleted = $model->where('id', $id)->delete();
        $get = $model->orderBy('id', 'desc')->findAll();
        return $this->response->setJSON(['response' => $get]);
    }
    public function update(){
        $id = $this->request->getJSON(true);
        $model = new Message();
        $columnData = [
            'read' => 1
        ];
        $update = $model->where('id', $id)->set($columnData)->update();
        $get = $model->orderBy('id', 'desc')->findAll();
        return $this->response->setJSON(['response' => $get]);
    }
}
