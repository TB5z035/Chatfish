"""
Extra settings.

Variables defined in this file will overwrite the variables in app.settings with the same name.
"""
import os
import json


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'this_is_a_sercet_with_typo_so_no_one_shall_know_it'

with open(os.path.join(BASE_DIR, "config", "mysql-config-local.json"), "r") as f:
    DATABASES = json.load(f)

STATICFILES_DIR = os.path.join(BASE_DIR, 'frontend', 'build')

with open(os.path.join(BASE_DIR, "config", "config.json"), "r") as f:
    config_json = json.load(f)
    TEST_PWD = config_json.get('test_pwd')
    WRONG_PWD = config_json.get('wrong_pwd')
    SALT = config_json.get('salt')
