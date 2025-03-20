from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class CourseTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='teacher1', role='teacher')
        self.client.force_authenticate(user=self.user)

    def test_create_course(self):
        response = self.client.post('/api/courses/', {'title': 'Test', 'description': '...'})
        self.assertEqual(response.status_code, 201)
# Create your tests here.
