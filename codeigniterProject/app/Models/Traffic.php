<?php 

namespace App\Models;
use CodeIgniter\Model;

class Traffic extends Model{

    protected $table = 'traffic';
    protected $allowedFields = ['id', 'name','created@'];

}