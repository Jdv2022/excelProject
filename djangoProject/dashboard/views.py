from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    data = {
        'name': 'John Doe',
        'age': 30,
        'occupation': 'Software Engineer',
    }
    return JsonResponse(data, safe=False)

@csrf_exempt
def saveToDb(request):
    
    return JsonResponse({'csrf_token': 'csrf_token'})


def csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

