from django.urls import path
from .views import HomePageView,submit_quiz, AboutView, ProductView, register_user, login_user,joining_form_view,dashboard_view,submit_tour_plan,training_quiz, product_videos # product_videos import karna na bhulein
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('home/', HomePageView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('product/', ProductView.as_view(), name='product'),
    path('quiz/', training_quiz, name='training_quiz'),
    path('home/dashboard/', dashboard_view, name='dashboard'),
    path('home/forms/', joining_form_view, name='forms'),
    path('', register_user, name='register'),
    path('account/login', login_user, name='login'),
    path('product/<int:product_id>/videos/', product_videos, name='product_videos'),
    path('product/video/<int:video_id>/submit_quiz/', submit_quiz, name='submit_quiz'),
    path('home/tour/', submit_tour_plan, name='tour'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)