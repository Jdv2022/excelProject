from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import csv
import requests
from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return JsonResponse({ 'main': 'success'})

@csrf_exempt
def saveToDb(request):
    csv_file  = request.FILES['file']
    csv_data = csv.reader(csv_file.read().decode('utf-8').splitlines())
    json_data = []
    fieldnames = next(csv_data)
    for row in csv_data:
        item = {}
        for i, value in enumerate(row):
            item[fieldnames[i]] = value
        json_data.append(item)
    return JsonResponse({'data': json_data})

def csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

def worldTour(request): 
    response0 = requests.get('https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/countries.json')
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



    



