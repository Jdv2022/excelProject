from django.db import models

class MyModel(models.Model):
    id = models.AutoField(primary_key=True)

    class Meta:
        db_table = 'main'

        

