# jango_app/management/commands/set_temp_password.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Sets a temporary password for a specific user. USE WITH CAUTION IN PRODUCTION!'

    def handle(self, *args, **options):
        User = get_user_model()
        username = 'adminuser'  # Your desired superuser username
        password = 'adminuser@123' # Your desired default password

        try:
            user = User.objects.get(username=username)
            # Ensure the user is a staff and superuser
            if not user.is_staff or not user.is_superuser:
                user.is_staff = True
                user.is_superuser = True
                user.save()
                self.stdout.write(self.style.WARNING(f'User "{username}" was not staff/superuser, updated.'))
            
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully set password for user "{username}"'))
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f'User "{username}" does not exist.'))