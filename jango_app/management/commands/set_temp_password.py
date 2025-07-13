# jango_app/management/commands/set_temp_password.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Sets a temporary password for a specific user. USE WITH CAUTION IN PRODUCTION!'

    def handle(self, *args, **options):
        User = get_user_model()
        username = 'adminuser'  # अपना सुपरयूज़र यूजरनेम
        password = 'adminuser@123' # अपना डिफ़ॉल्ट पासवर्ड

        try:
            user = User.objects.get(username=username)
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully set password for user "{username}"'))
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f'User "{username}" does not exist.'))