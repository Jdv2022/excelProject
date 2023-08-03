<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use App\Models\Traffic;
use CodeIgniter\Files\File;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class Process extends Controller{   

    //this function is for the landing page data to be rendered
    public function worldTour(){
        
        $curl1 = curl_init();
        curl_setopt($curl1, CURLOPT_URL, "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/population%20with%20world.json");
        curl_setopt($curl1, CURLOPT_CAINFO, 'C:\projects\excelProject\codeigniterProject\cacert-2023-05-30.pem');
        curl_setopt($curl1, CURLOPT_RETURNTRANSFER, true);
        $response1 = curl_exec($curl1);
        curl_close($curl1);
        $jsonData1 = json_decode($response1, true); // Set the second parameter to true for an associative array.

        $curl2 = curl_init();
        curl_setopt($curl2, CURLOPT_URL, "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/borders%20(1).json");
        curl_setopt($curl2, CURLOPT_CAINFO, 'C:\projects\excelProject\codeigniterProject\cacert-2023-05-30.pem');
        curl_setopt($curl2, CURLOPT_RETURNTRANSFER, true);
        $response2 = curl_exec($curl2);
        curl_close($curl2);
        $jsonData2 = json_decode($response2, true); // Set the second parameter to true for an associative array.

        $curl3 = curl_init();
        curl_setopt($curl3, CURLOPT_URL, "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/land%20(1).json");
        curl_setopt($curl3, CURLOPT_CAINFO, 'C:\projects\excelProject\codeigniterProject\cacert-2023-05-30.pem');
        curl_setopt($curl3, CURLOPT_RETURNTRANSFER, true);
        $response3 = curl_exec($curl3);
        curl_close($curl3);
        $jsonData3 = json_decode($response3, true); // Set the second parameter to true for an associative array.

        $curl4 = curl_init();
        curl_setopt($curl4, CURLOPT_URL, "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/world%20(1).json");
        curl_setopt($curl4, CURLOPT_CAINFO, 'C:\projects\excelProject\codeigniterProject\cacert-2023-05-30.pem');
        curl_setopt($curl4, CURLOPT_RETURNTRANSFER, true);
        $response4 = curl_exec($curl4);
        curl_close($curl4);
        $jsonData4 = json_decode($response4, true); // Set the second parameter to true for an associative array.

        return $this->response->setJSON([
            'data0' => $jsonData1,
            'data1' => $jsonData2,
            'data2' => $jsonData3,
            'data3' => $jsonData4,
        ]);
    }

    public function convertToJson(){
        $file = $this->request->getFiles();
        $uploaded_data = $this->request->getFile('file');
        $file_contents = file_get_contents($file['file']);
        $json_data = [];
        $value = '';
        $extention = '';
        $file_name = $uploaded_data->getName();
        for ($i = strlen($file_name)-1 ; $i >= 0; $i--) {
            $extention = $file_name[$i] . $extention;
            if($file_name[$i] == '.'){
                break;
            }
        }
        if($extention == '.csv'){
            $lines = explode("\r", $file_contents);
            $keys = str_getcsv($lines[0]);
            for ($i = 1; $i < count($lines); $i++) {
                $value = str_getcsv($lines[$i]);
                $obj = new \stdClass();
                for ($j = 0; $j < count($keys); $j++) {
                    if (isset($keys[$j]) && isset($value[$j])) {
                        $obj->{$keys[$j]} = $value[$j];
                    }
                }
                $json_data[] = $obj;
            }
            return $this->response->setJSON(['data' => $json_data]);
        }
        else if($extention == '.xlsx'){
            $spreadsheet = IOFactory::load($uploaded_data);
            // Get the active sheet (usually the first sheet)
            $sheet = $spreadsheet->getActiveSheet();
            // Get the highest row and column indices (number of rows and columns with data)
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();
            $data = [];
            // Loop through each row and column to read data
            for ($row = 1; $row <= $highestRow; $row++) {
                $rowData = [];
                $obj = new \stdClass();
                for ($colIndex = 1; $colIndex <= Coordinate::columnIndexFromString($highestColumn); $colIndex++) {
                    $col = Coordinate::stringFromColumnIndex($colIndex);
                    $cellValue = $sheet->getCell($col . $row)->getValue();
                    $headerValue = $sheet->getCell($col . 1)->getValue();
                    if($row != 1){
                        $obj->{$headerValue} = $cellValue;
                    }
                }
                if($row != 1){
                    $data[] = $obj;
                }
            }
            return $this->response->setJSON(['data' => $data]);
        }
    }
    public function phMap(){
        $curl1 = curl_init();
        curl_setopt($curl1, CURLOPT_URL, "https://raw.githubusercontent.com/Jdv2022/Ph-Map-d3.js-/main/geoJson.json");
        curl_setopt($curl1, CURLOPT_CAINFO, 'C:\projects\excelProject\codeigniterProject\cacert-2023-05-30.pem');
        curl_setopt($curl1, CURLOPT_RETURNTRANSFER, true); // Set this option to receive the response as a string.
        $response1 = curl_exec($curl1);
        curl_close($curl1);
    
        // Now parse the JSON response using json_decode.
        $jsonData = json_decode($response1, true); // Set the second parameter to true for an associative array.
    
        return $this->response->setJSON(['data0' => $jsonData]);
    }
    public function philippines(){
        $jsonArray = json_decode(file_get_contents('php://input'),true); 
        $table_data = $jsonArray['tableData'];
        $tool = $jsonArray['tool'];
        $geoJson = $jsonArray['geoJson']['features'];
        $arrMax = [];
        $arrMid = [];
        $arrMin = [];
        $arrNoData = [];
        $newArrMax = [];
        $newArrMid = [];
        $newArrMin = [];
        $noDataArray = [];
        $obj = new \stdClass();
        $columns = array_keys($table_data[0]);
        $column1 = $columns[0];
        $column2 = $columns[1];
        $tableD = $table_data;
        $maxUpD = (int)$tool['max'];
        $midMaxD = (int)$tool['maxmid'];
        $midMinD = (int)$tool['minmid'];
        $minD = (int)$tool['min'];
        if ($maxUpD || $midMaxD || $midMinD || $minD){
            foreach ($geoJson as $item){
                $name = $item['properties']['ADM2_EN'];
                $value = $item;
                $obj->{$name} = $value;
            }
            foreach ($tableD as $items){
                $item = (int)$items[$column2];
                $name = $items[$column1];
                if (($item >= $maxUpD) && $maxUpD){
                    $arrMax[] = $name;
                }
                else if ($item <= $midMaxD && $item >= $midMinD && $midMaxD && $midMinD){
                    $arrMid[] = $name;
                }
                else if ($item < $midMinD && $item >= $minD && $midMinD && ($minD || $minD == 0)){
                    $arrMin[] = $name;
                }
                else {
                    $arrNoData[] = $name;
                }
            }
            $segragatedData = [$arrMax, $arrMid, $arrMin, $arrNoData];
            $count = 0;
            foreach ($segragatedData as $item1){
                foreach ($item1 as $name){
                    if ($count==0 && $obj->$name){
                        $newArrMax[] = $obj->$name;
                    }
                    else if ($count==1 && $obj->$name){
                        $newArrMid[] = $obj->$name;
                    }
                    else if ($count==2 && $obj->$name){
                        $newArrMin[] = $obj->$name;
                    }
                    else if ($count==3 && $obj->$name){
                        $noDataArray[] = $obj->$name;
                    }
                }
                $count++;
            }
           
        }
        return $this->response->setJSON([
            'arrNoData' => $arrNoData, 
            'newArrMax' => $newArrMax, 
            'newArrMid' => $newArrMid, 
            'newArrMin' => $newArrMin, 
            'noDataArray' => $noDataArray, 
        ]);
    }
    public function phRegion(){
        $locations = array(
            'Region I' => array('x' => 450, 'y' => 500),
            'Cordillera Administrative Region' => array('x' => 580, 'y' => 450),
            'Region II' => array('x' => 680, 'y' => 470),
            'Region III' => array('x' => 500, 'y' => 700),
            'National Capital Region' => array('x' => 350, 'y' => 750),
            'Region IV-A' => array('x' => 650, 'y' => 800),
            'Region V' => array('x' => 900, 'y' => 900),
            'Region IV-B' => array('x' => 400, 'y' => 1100),
            'Region VI' => array('x' => 725, 'y' => 1175),
            'Region VIII' => array('x' => 1000, 'y' => 1100),
            'Negros Island Region' => array('x' => 750, 'y' => 1350),
            'Region VII' => array('x' => 900, 'y' => 1300),
            'Region IX' => array('x' => 750, 'y' => 1500),
            'Region X' => array('x' => 950, 'y' => 1450),
            'Region XIII' => array('x' => 1100, 'y' => 1450),
            'Region XI' => array('x' => 1150, 'y' => 1600),
            'Autonomous Region in Muslim Mindanao' => array('x' => 900, 'y' => 1625),
            'Region XII' => array('x' => 1000, 'y' => 1750),
        );
        $body_data = json_decode(file_get_contents('php://input'),true);
        $raw = $body_data['raw'];
        $geoJson = $body_data['geoJson'];
        $objTable = new \stdClass();
        $key_s = array_keys($raw[0]);
        $region_name = $key_s[0];
        $arr1 = [];
        $filterRaw = [];
        if ($geoJson){
            //get what are user's region
            foreach ($raw as $item){
                $objTable->{$item[$region_name]} = $item;
            }
            //filter what is in the geoJson from user's input 
            foreach ($geoJson['features'] as $item){
                $name = $item['properties']['ADM1_EN'];
                if ($objTable->$name){
                    $item['color'] = $objTable->$name;
                    $arr1[] = $item;
                } 
            }
        }
        //datas from user (amount #) 
        foreach ($raw as $item){
            $filterRaw[] = $item;
        } 
        function amounts($params, $params2){
            $array = [];
            $counts = 0;
            foreach($params2 as $item){
                if($counts > 0 && $counts < count($params2)-1){
                    $array[] = $params[$item];
                }
                $counts++;
            }
            return $array;
        }
        $counter = 0;
        foreach ($raw as $item){
            $filterRaw[$counter]['loc'] = $locations[$item['region']];
            $filterRaw[$counter]['amount'] = amounts($item, $key_s);
            $counter++;
        }

        return $this->response->setJSON([
            'filterRaw'=> $filterRaw,
            'arr1'=> $arr1
        ]);
    }
}