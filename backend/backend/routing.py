from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # This URL pattern can be simplified since you're using a global group (cards_group)
    re_path(r"ws/cards/$", consumers.CardStatusConsumer.as_asgi()),  # No dynamic room name anymore
]
