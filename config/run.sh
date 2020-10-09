#!/bin/sh
python manage.py migrate
gunicorn 'app.wsgi' -b 0.0.0.0:8000 --access-logfile - --log-level info &
node server/server.js
