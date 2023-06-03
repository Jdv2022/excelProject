from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import csv
import json

def index(request):
    data = {
        'name': 'John Doe',
        'age': 30,
        'occupation': 'Software Engineer',
    }
    return JsonResponse(data, safe=False)

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
    print(json_data)
    return JsonResponse({'csrf_token': 'csrf_token'})


def csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

