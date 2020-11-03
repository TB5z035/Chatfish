"""
Extra settings.

Variables defined in this file will overwrite the variables in app.settings with the same name.
"""
import os
import json


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEBUG = True
SECRET_KEY = 'this_is_a_sercet_with_typo_so_no_one_shall_know_it'

with open(os.path.join(BASE_DIR, "config", "mysql-config.json"), "r") as f:
    DATABASES = json.load(f)

STATICFILES_DIR = os.path.join(BASE_DIR, 'frontend', 'build')
