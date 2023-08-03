<?php

namespace App\Controllers;
use App\Models\Traffic;

class Traffics extends BaseController{

    public function log(){
        $name = $this->request->getJSON();
        $model = new Traffic();
        $total = $model->countAll();
        $data = [
            'name' => $name,
            'created@' => date('Y-m-d H:i:s')
        ];
        $inserted = $model->insert($data);
    }
    
    public function getlog(){
        $model = new Traffic();
        $orig = $model->findAll();
        $get = $model->select("name, DATE(`created@`) as created_date, COUNT(`created@`) as name_count")
            ->groupBy("name, created_date")
            ->get()
            ->getResult();
        foreach($orig as $key => $item){
            $dateOnly1 = date('Y-m-d', strtotime($item['created@']));
            foreach($get as $item2){
                if($item2->created_date == $dateOnly1 && $item2->name == $item['name']){
                    $orig[$key]['count'] = $item2->name_count;
                }
            }
        }  
        if ($orig) {
            return $this->response->setJSON(['response' => $orig]);
        } 
        else {
            return $this->response->setJSON(['response' => null]);
        }
    }

    public function getTime(){
        $model = new Traffic();
        $temp = [];
        $count = 0;
        $get = $model->select("name, HOUR(`created@`) as hr, MINUTE(`created@`) as min, COUNT(`created@`) as name_count")
            ->groupBy("name, hr, min")
            ->get()
            ->getResult();
        if ($get) {
            return $this->response->setJSON(['response' => $get]);
        } 
        else {
            return $this->response->setJSON(['response' => null]);
        }
    }

}