from django.apps import AppConfig


class JangoAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jango_app'

    def ready(self):
        import jango_app.signals
# core/apps.py



    
