# Procfile (at your project's root, next to manage.py)
release: python manage.py migrate --noinput && python manage.py createsuperuser --noinput --username adminuser --email admin@example.com || true && python manage.py set_temp_password || true && python manage.py collectstatic --noinput
web: gunicorn jango.wsgi:application --log-file -