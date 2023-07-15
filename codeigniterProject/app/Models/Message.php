<?php 

namespace App\Models;
use CodeIgniter\Model;

class Message extends Model{

    protected $table = 'messages';
    protected $allowedFields = ['id','name', 'title','read', 'message', 'created@', 'updated@'];

}