'''
Basic views
'''
import os

from django.conf import settings
from django.http import FileResponse
from django.http import HttpResponseNotFound


def serve_static(request, path='/index.html'):
    '''
    Return static files,
    as django.contrib.staticfiles is disabled in production mode.

    Actually, static files shall be served separately, for example with nginx.
    '''
    path = '%s/%s' % (getattr(settings, 'STATICFILES_DIR'), path)
    if os.path.isfile(path):
        return FileResponse(open(path, 'rb'))
    return HttpResponseNotFound()
