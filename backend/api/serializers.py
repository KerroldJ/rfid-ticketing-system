from rest_framework import serializers
from .models import Card, DeactivatedCard, Log

# ================================================================ #
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    
# ================================================================ #
class CardSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = ['id', 'card_id', 'status', 'type', 'date', 'time']

    def get_date(self, obj):
        return obj.get_date()  # Calls the model's get_date method

    def get_time(self, obj):
        return obj.get_time()  # Calls the model's get_time method
# ================================================================ #

class DeactivatedCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeactivatedCard
        fields = ['id', 'card_id', 'status', 'deactivated_date', 'deactivated_time']
# ================================================================ #

class LogSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")
    time = serializers.SerializerMethodField()  # Use a method to format the time

    class Meta:
        model = Log
        fields = ['card_id', 'status', 'role', 'type', 'date', 'time']

    def get_time(self, obj):
        # Format the time to 12-hour format with AM/PM
        if obj.time:
            return obj.time.strftime('%I:%M:%S %p')  # Convert to 12-hour format
        return None



