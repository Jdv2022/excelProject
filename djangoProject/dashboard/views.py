from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import csv
import requests
from django.http import HttpResponse
import json
import pandas as pd
import csv

def index(request):
    return JsonResponse({ 'main': 'success'})

def convert_to_json(file, file_format):
    json_data = []
    if file_format == 'xlsx':
        df = pd.read_excel(file, header=0)
        for _, row in df.iterrows():
            item = {}
            for column_name, value in row.items():
                item[column_name] = value
            json_data.append(item)
    
    elif file_format == 'csv':
        csv_data = csv.reader(file.read().decode('utf-8').splitlines())
        fieldnames = next(csv_data)
        for row in csv_data:
            item = {}
            for i, value in enumerate(row):
                item[fieldnames[i]] = value
            json_data.append(item)
    
    return json_data
@csrf_exempt
def saveToDb(request):
    if request.method == 'POST' and 'file' in request.FILES:
        file = request.FILES['file']
        file_format = file.name.split('.')[-1].lower()
        json_data = convert_to_json(file, file_format)
        return JsonResponse({'data': json_data})
    return JsonResponse({'message': 'No file uploaded or incorrect method.'})


def csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

def phMap(request):
    response0 = requests.get('https://raw.githubusercontent.com/Jdv2022/Ph-Map-d3.js-/main/geoJson.json')
    if response0.status_code == 200:
        data0 = response0.json()
        return JsonResponse({'data0': data0})
    else:
        return HttpResponse('Error: Failed to fetch data from the API')

def worldTour(request): 
    response0 = requests.get('https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/population%20with%20world.json')
    response1 = requests.get('https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/borders%20(1).json')
    response2 = requests.get('https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/land%20(1).json')
    response3 = requests.get('https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/world%20(1).json')

    # Check if the request was successful (status code 200)
    if response0.status_code == 200:
        # Access the response data
        data0 = response0.json()
        data1 = response1.json()
        data2 = response2.json()
        data3 = response3.json()

        # Process the data or pass it to the template
        return JsonResponse({'data0': data0, 'data1': data1, 'data2': data2, 'data3': data3})
    else:
        # Handle the error case
        return HttpResponse('Error: Failed to fetch data from the API')
    
@csrf_exempt
def Philippines(request):
    body_data = json.loads(request.body)
    table_data = body_data['tableData']
    tool = body_data['tool']
    geoJson = body_data['geoJson']['features']
    arrMax = []
    arrMid = []
    arrMin = []
    arrNoData = []
    newArrMax = []
    newArrMid = []
    newArrMin = []
    noDataArray = []
    obj = {}
    columns = table_data[0].keys()
    key_list = list(columns)
    column1 = key_list[0]
    column2 = key_list[1]
    tableD = table_data
    maxUpD = int(tool['max'])
    midMaxD = int(tool['maxmid'])
    midMinD = int(tool['minmid'])
    minD = int(tool['min'])
    if maxUpD or midMaxD or midMinD or minD:
        for item in geoJson:
            name = item['properties']['ADM2_EN']
            value = item
            obj[name] = value
        for items in tableD:
            item = int(items[column2])
            name = items[column1]
            if (item >= maxUpD) and maxUpD:
                arrMax.append(name)
            elif (item <= midMaxD and item >= midMinD and midMaxD and midMinD):
                arrMid.append(name)
            elif(item < midMinD and item >= minD and midMinD and (minD or minD == 0)):
                arrMin.append(name)
            else:
                arrNoData.append(name)
        segragatedData = [arrMax, arrMid, arrMin, arrNoData]
        for i, item1 in enumerate(segragatedData):
            for name in item1:
                if (i==0 and obj[name]):
                    newArrMax.append(obj[name])
                elif (i==1 and obj[name]):
                    newArrMid.append(obj[name])
                elif (i==2 and obj[name]):
                    newArrMin.append(obj[name])
                elif (i==3 and obj[name]):
                    noDataArray.append(obj[name])

        return JsonResponse({
            'arrNoData':arrNoData, 
            'newArrMax':newArrMax, 
            'newArrMid':newArrMid, 
            'newArrMin':newArrMin, 
            'noDataArray':noDataArray, 
        })
    
@csrf_exempt 
def phRegion(request):
    """ /* Hard coded x and y coordinates for pie graph */ """
    locations = {
        'Region I':{'x':450,'y':500},
        'Cordillera Administrative Region':{'x':580,'y':450},
        'Region II':{'x':680,'y':470},
        'Region III':{'x':500,'y':700},
        'National Capital Region':{'x':350,'y':750},
        'Region IV-A':{'x':650,'y':800},
        'Region V':{'x':900,'y':900},
        'Region IV-B':{'x':400,'y':1100},
        'Region VI':{'x':725,'y':1175},
        'Region VIII':{'x':1000,'y':1100},
        'Negros Island Region':{'x':750,'y':1350},
        'Region VII':{'x':900,'y':1300},
        'Region IX':{'x':750,'y':1500},
        'Region X':{'x':950,'y':1450},
        'Region XIII':{'x':1100,'y':1450},
        'Region XI':{'x':1150,'y':1600},
        'Autonomous Region in Muslim Mindanao':{'x':900,'y':1625},
        'Region XII':{'x':1000,'y':1750},
    }
    body_data = json.loads(request.body)
    raw = body_data['raw']
    geoJson = body_data['geoJson']
    objTable:any = {}
    key_s = raw[0].keys()
    key = list(key_s)
    region_name = key[0]
    arr1 = []
    filterRaw = []
    if geoJson:
        """ //get what are user's region """
        for item in raw:
           objTable[item[region_name]] = item
        
        """ //filter what is in the geoJson from user's input """
        for item in geoJson['features']:
            name = item['properties']['ADM1_EN']
            if objTable[name]:
                appendData = item
                appendData['color'] = objTable[name]
                arr1.append(appendData)
            
        """ //datas from user (amount #) """
        for item in raw:
            filterRaw.append(item)

        def amounts(item):
            array = []
            for i, key0 in enumerate(key):
                if i>0 and i<len(key)-1:
                    array.append(item[key0])
            return array
        
        for i, item in enumerate(raw):
            filterRaw[i]['loc'] = locations[item['region']]
            filterRaw[i]['amount'] = amounts(item)

    return JsonResponse({
        'filterRaw': filterRaw,
        'arr1': arr1
    })


