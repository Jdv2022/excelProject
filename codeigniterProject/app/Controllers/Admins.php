<?php

namespace App\Controllers;
use App\Models\Admin;

class Admins extends BaseController{
    public function adminLogin(){
        $username = $this->request->getPost('username');
        $password = $this->request->getPost('password');
        $model = new Admin();
        $admins = $model->where('username', $username)->findAll();
        if($admins){
            foreach ($admins as $item){
                if($item['password'] == $password){
                    $updatedItem = [
                        'id' => $item['id'],
                        'status' => 1, 
                        'name' => $item['name'],
                        'username' => $item['username'],
                        'password' => $item['password'],
                        'created@' => $item['created@'],
                        'updated@' => $item['updated@'],
                    ];
                    $model->update($item['id'], $updatedItem);
                    return $this->response->setJSON(['response' => true]);
                }
            }
            return $this->response->setJSON(['response' => 'Incorrect password or email.']);
        }
        else {
            return $this->response->setJSON(['response' => 'Incorrect password or email.']);
        }
    }
    public function adminLogout(){
        $model = new Admin();
        $admins = $model->where('username', 'admin')->findAll();
        if($admins){
            foreach ($admins as $item){
                if($item['password'] == 'admin'){
                    $updatedItem = [
                        'id' => $item['id'],
                        'status' => 0, 
                        'name' => $item['name'],
                        'username' => $item['username'],
                        'password' => $item['password'],
                        'created@' => $item['created@'],
                        'updated@' => $item['updated@'],
                    ];
                    $model->update($item['id'], $updatedItem);
                    return $this->response->setJSON(['response' => true]);
                }
            }
            return $this->response->setJSON(['response' => 'Incorrect password or email.']);
        }
        else {
            return $this->response->setJSON(['response' => 'Incorrect password or email.']);
        }
    }
}
