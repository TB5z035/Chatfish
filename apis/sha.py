from config.local_settings import SALT
import hashlib

def get_key(body):
    sha3_512 = hashlib.sha3_512((body + SALT).encode('utf-8'))
    return sha3_512.hexdigest()