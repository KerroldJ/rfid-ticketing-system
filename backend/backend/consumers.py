from channels.generic.websocket import AsyncWebsocketConsumer
import json

class CardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the card_updates group
        await self.channel_layer.group_add("card_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the card_updates group
        await self.channel_layer.group_discard("card_updates", self.channel_name)

    # Custom method to handle broadcast
    async def send_card_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
