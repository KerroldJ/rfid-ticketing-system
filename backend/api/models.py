from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


# ============================================================================== #
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    rfid_code = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f'{self.user.username} Profile'
    
# ============================================================================== #
class Card(models.Model):
    REGULAR = 'Regular'
    VIP = 'VIP'
    ACTIVATED = 'Activated'
    DEACTIVATED = 'Deactivated'

    STATUS_CHOICES = [
        (ACTIVATED, 'Activate'),
        (DEACTIVATED, 'Deactivate'),
    ]
    
    TYPE_CHOICES = [
        (REGULAR, 'Regular'),
        (VIP, 'VIP'),
    ]

    # Model fields
    card_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    created_date = models.DateField(null=True, blank=True)
    created_time = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.card_id

    def save(self, *args, **kwargs):
        if not self.created_date and not self.created_time:
            current_time = timezone.localtime(timezone.now())
            self.created_date = current_time.date()
            self.created_time = current_time.strftime('%I:%M %p')

        if self.pk:  
            original_status = Card.objects.get(pk=self.pk).status
            if original_status != self.status and self.status == self.DEACTIVATED:
                current_time = timezone.localtime(timezone.now())
                self.created_date = current_time.date()
                self.created_time = current_time.strftime('%I:%M %p')
        super().save(*args, **kwargs)

    def get_date(self):
        return self.created_date if self.created_date else "Unknown Date"
    
    def get_time(self):
        return self.created_time if self.created_time else "Unknown Time"

# ============================================================================== #  
class DeactivatedCard(models.Model):
    card_id = models.CharField(max_length=100)
    status = models.CharField(max_length=15, default='Deactivated')
    deactivated_date = models.DateField(null=True, blank=True)
    deactivated_time = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"Card {self.card_id} - {self.status}"

    def save(self, *args, **kwargs):
        # Automatically set the deactivation date and time if not already set
        if self.status == 'Deactivated' and (not self.deactivated_date or not self.deactivated_time):
            local_time = timezone.localtime(timezone.now())
            self.deactivated_date = self.deactivated_date or local_time.date()
            self.deactivated_time = self.deactivated_time or local_time.strftime('%I:%M %p')
        
        # Save the card
        super().save(*args, **kwargs)
        Log.objects.create(card=self)

# ============================================================================== # 
class Log(models.Model):
    card_id = models.CharField(max_length=50, null=True)
    status = models.CharField(max_length=50)
    role = models.CharField(max_length=50, default="Admin")
    type = models.CharField(max_length=10, null=True, blank=True)  # Allow null/blank for type
    date = models.DateField(default=timezone.localdate)  
    time = models.TimeField(default=timezone.now)  # Set default to current time
    
    def __str__(self):
        # Format the time to display as 'HH:MM AM/PM'
        formatted_time = self.time.strftime('%I:%M %p')
        return (f"Card ID: {self.card_id}, Status: {self.status}, Role: {self.role}, "
                f"Type: {self.type or 'Unknown'}, Date: {self.date}, Time: {formatted_time}")

    def save(self, *args, **kwargs):
        # Ensure date and time are set if not provided
        if not self.date:
            self.date = timezone.localdate() 
        if not self.time:
            self.time = timezone.localtime().time()  # Default to local time if not set
        super().save(*args, **kwargs)