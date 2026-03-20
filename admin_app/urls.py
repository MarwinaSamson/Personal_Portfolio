from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.dashboard, name='admin_dashboard'),
    # Use Django's auth login view and the custom registration/login.html template
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='admin_login'),
    # API endpoints for CMS actions
    path('api/save-profile/', views.save_profile, name='api_save_profile'),
    path('api/save-project/', views.save_project, name='api_save_project'),
    path('api/save-skills/', views.save_skills, name='api_save_skills'),
    path('api/delete-project/<int:project_id>/', views.delete_project, name='api_delete_project'),
    path('api/project/<int:project_id>/', views.get_project, name='api_get_project'),
    path('api/messages/', views.get_messages, name='api_get_messages'),
    path('api/mark-message-read/<int:msg_id>/', views.mark_message_read, name='api_mark_message_read'),
    path('api/delete-message/<int:msg_id>/', views.delete_message, name='api_delete_message'),
    path('api/save-about/', views.save_about, name='api_save_about'),
    path('api/save-profile-image/', views.save_profile_image, name='api_save_profile_image'),
    path('api/save-skill/', views.save_skill, name='api_save_skill'),
    path('api/delete-skill/<int:skill_id>/', views.delete_skill, name='api_delete_skill'),
]

