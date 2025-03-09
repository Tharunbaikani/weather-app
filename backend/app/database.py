import os
import pymongo
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(MONGODB_URI)
db = client["weather_db"]
weather_collection = db["weather_records"]
