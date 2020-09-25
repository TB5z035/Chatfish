'''
Test suite for meeting
'''
import datetime
from django.test import TestCase

class TestMeetingEndpoint(TestCase):
    '''
    TestCase for /meeting
    '''

    def test_get(self):
        '''Test /meeting GET'''
        date = datetime.date(2000, 1, 1)
        pass

