<?php 

namespace App\Models;
use CodeIgniter\Model;

class Bug extends Model{

    protected $table = 'bugs';
    protected $allowedFields = ['id','name', 'bug','read', 'messages', 'created@', 'updated@'];

}