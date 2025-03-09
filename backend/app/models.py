

from pydantic import BaseModel
from datetime import datetime
# from typing import Optional


class WeatherRequest(BaseModel):
    location: str
    
    
    
class WeatherRecord(BaseModel):
    record_id: str
    location: str
    weather_data: dict
    created_at: datetime

   
