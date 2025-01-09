from django.urls import path
from . import views

urlpatterns = [
    path('rfid_login/', views.rfid_login_view, name='rfid_login'),
    
    path('login/', views.login_view, name='login'),  
    path('update-password/', views.update_password, name='update_password'),
    path('cards/', views.card_list_create, name='card-list-create'),
    
    path('check-status/<str:card_id>/', views.check_card_status, name='check_card_status'),
    path('deactivate/<str:card_id>/', views.deactivate_card, name='deactivate_card'),
    path('activate/<str:card_id>/', views.reactivate_card, name='activate_card'),
    
    path('deactivate_all_cards/', views.deactivate_all_cards, name='deactivate_all_cards'),
    
    
    path('weekly-clients/', views.weekly_deactivated_cards, name='weekly_deactivated_cards'),
    path('card-logs/', views.log_list, name='card-logs'),
]

