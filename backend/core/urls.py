# """
# URL configuration for core project.

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/5.1/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """
# from django.urls import path, include
# from django.views.generic import RedirectView
# from django.contrib import admin
# from .views import home
# from django.conf import settings
# from django.conf.urls.static import static
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi
# from rest_framework_simplejwt.views import TokenObtainPairView

# schema_view = get_schema_view(
#    openapi.Info(title="University API", default_version='v1'),
#    public=True,
# )
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/auth/', include(('users.urls', 'users'), namespace='users_auth')),
#     path('api/', include('users.urls' )),
#     path('api/', include('university.urls')),
#     path('api/auth/password_reset/', include('django_rest_passwordreset.urls', namespace='drp_password_reset')),
#     path('api/courses/', include(('courses.urls', 'courses'), namespace='courses')),
#     path('api/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('', home, name='home'),  # Root URL
#     path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
#     path('ckeditor5/', include('django_ckeditor_5.urls')),


# ]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/university/', include('university.urls')),
    path('api/', include('courses.urls')),
    path('api/invitations/', include('invitations.urls')),
]