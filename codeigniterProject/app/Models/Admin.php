<?php 

namespace App\Models;
use CodeIgniter\Model;

class Admin extends Model{

    protected $table = 'admins';
    protected $allowedFields = ['id', 'status', 'name', 'username','password', 'created@', 'updated@'];

}