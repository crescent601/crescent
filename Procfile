release: python manage.py migrate --noinput && python manage.py collectstatic --noinput
web: gunicorn jango.wsgi:application --log-file -