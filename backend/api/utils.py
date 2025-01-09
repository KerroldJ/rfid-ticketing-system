from django.utils import timezone
from .models import Log

def create_log(card_id, status, role=None, card_type=None):
    # Set default values if role or card_type are None
    role = role or "Admin"
    card_type = card_type or "Unknown"

    try:
        # Get the current time in UTC and convert it to local time
        current_time = timezone.localtime(timezone.now())

        # Create the log entry
        log_entry = Log.objects.create(
            card_id=card_id,
            status=status,
            role=role,
            type=card_type,  # Ensure the field name matches (type vs card_type)
            date=current_time.date(),
            time=current_time.time()
        )
        return log_entry
    except Exception as e:
        raise ValueError(f"Failed to create log: {str(e)}")