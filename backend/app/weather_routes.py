from fastapi import APIRouter, HTTPException
import requests
import os
from dotenv import load_dotenv
from app.database import weather_collection  # MongoDB connection
from app.models import WeatherRequest
import pandas as pd
from fpdf import FPDF
from datetime import datetime
import uuid
from fastapi.responses import StreamingResponse
import io
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api", tags=["Weather"])
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# 🔹 Convert location to lat/lon (City, Zip, GPS, Landmarks)
def get_location_data(location: str):
    if "," in location:  # If GPS Coordinates
        lat, lon = location.split(",")
        return {"lat": lat.strip(), "lon": lon.strip()}

    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={location}&limit=1&appid={OPENWEATHER_API_KEY}"
    geo_response = requests.get(geo_url).json()

    if not geo_response:
        raise HTTPException(status_code=404, detail="Location not found")

    lat, lon = geo_response[0]["lat"], geo_response[0]["lon"]
    return {"lat": lat, "lon": lon}

def get_youtube_videos(location: str):
    youtube_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={location}+travel&key={YOUTUBE_API_KEY}&maxResults=5"
    response = requests.get(youtube_url).json()

    if "items" not in response:
        return []

    return [
        {
            "title": video["snippet"]["title"],
            "url": f"https://www.youtube.com/watch?v={video['id']['videoId']}",
            "thumbnail": video["snippet"]["thumbnails"]["medium"]["url"]
        }
        for video in response.get("items", []) if video.get("id", {}).get("videoId")
    ]

# ✅ Fetch Wikipedia Summary
def get_wikipedia_summary(location: str):
    wiki_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{location.replace(' ', '_')}"
    response = requests.get(wiki_url).json()

    if "extract" not in response:
        return {}

    return {
        "summary": response["extract"],
        "wikipedia_url": response["content_urls"]["desktop"]["page"]
    }

# ✅ Get current weather
@router.get("/weather")
def get_weather(location: str):
    location_data = get_location_data(location)
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={location_data['lat']}&lon={location_data['lon']}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(weather_url).json()

    # if "main" not in response:
    #     raise HTTPException(status_code=400, detail="Weather data not available")
    if str(response.get("cod")) != "200":
        raise HTTPException(
            status_code=int(response.get("cod", 400)),
            detail=response.get("message", "Weather data not available")
        )
    
     # Fetch YouTube Videos
    weather_data = {
        "location": response["name"],
        "temperature": response["main"]["temp"],
        "weather": response["weather"][0]["description"],
        "icon": response["weather"][0]["icon"],
        "humidity": response["main"]["humidity"],
        "wind_speed": response["wind"]["speed"],
         }

    # 🔹 Fetch top 5 YouTube videos for this location
    videos = get_youtube_videos(location)

    # Return everything as one JSON
    return {
        **weather_data,
        "youtube_videos": videos,
        # If you also want Wikipedia summary, uncomment next line:
        "wikipedia": get_wikipedia_summary(location),
    }
    
    # return {
    #     "location": response["name"],
    #     "temperature": response["main"]["temp"],
    #     "weather": response["weather"][0]["description"],
    #     "icon": response["weather"][0]["icon"],
    #     "humidity": response["main"]["humidity"],
    #     "wind_speed": response["wind"]["speed"],
    #     # "youtube_videos": get_youtube_videos(location),
    #     # "wikipedia": get_wikipedia_summary(location)
    # }

# ✅ Get 5-day weather forecast
@router.get("/forecast")
def get_forecast(location: str):
    location_data = get_location_data(location)
    forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?lat={location_data['lat']}&lon={location_data['lon']}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(forecast_url).json()

    # if "list" not in response:
    #     raise HTTPException(status_code=400, detail="Forecast data not available")
    if str(response.get("cod")) != "200":
        raise HTTPException(
            status_code=int(response.get("cod", 400)),
            detail=response.get("message", "Forecast data not available")
        )
    forecast = [
        {"date": item["dt_txt"],
         "temp": item["main"]["temp"],
         "weather": item["weather"][0]["description"],
         "icon": item["weather"][0]["icon"]
         }
        for item in response["list"] if "dt_txt" in item
    ]
    
    return {"location": response["city"]["name"], "forecast": forecast}


@router.post("/weather/save")
def save_weather(data: WeatherRequest):
    
    # Get lat/lon
    location_data = get_location_data(data.location)

    
    
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={location_data['lat']}&lon={location_data['lon']}&appid={OPENWEATHER_API_KEY}&units=metric"
    
    # forecast_url = f"http://api.openweathermap.org/data/2.5/weather?lat={location_data['lat']}&lon={location_data['lon']}&appid={OPENWEATHER_API_KEY}&units=metric"
    weather_response = requests.get(weather_url).json()
    # logging.info(f"Weather response: {weather_response}")
   
    if str(weather_response.get("cod")) != "200":
        raise HTTPException(
            status_code=int(weather_response.get("cod", 400)),
            detail=weather_response.get("message", "Weather data not available")
        )
    
    filtered_weather_data = {
        "temperature": weather_response["main"]["temp"],
        "humidity": weather_response["main"]["humidity"],
        "wind_speed": weather_response["wind"]["speed"],
        "weather_description": weather_response["weather"][0]["description"]
    }

    new_record = {
        "record_id": str(uuid.uuid4()),
        "location": data.location,
        # "weather_data": weather_response,
        "weather_data": filtered_weather_data,

        "created_at": datetime.utcnow()
    }

    weather_collection.insert_one(new_record)
    return {
        "message": "Record saved successfully!",
        "record_id": new_record["record_id"]
    }

# ✅ Read Weather Records (CRUD - READ)
@router.get("/weather-records")
def get_weather_records():
    records = list(weather_collection.find({}, {"_id": 0}))
    return records


@router.put("/weather/update/{record_id}")
def update_weather(record_id: str, data: WeatherRequest):
    # Fetch new weather data for the updated location
    location_data = get_location_data(data.location)
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={location_data['lat']}&lon={location_data['lon']}&appid={OPENWEATHER_API_KEY}&units=metric"
    weather_response = requests.get(weather_url).json()
    if str(weather_response.get("cod")) != "200":
        raise HTTPException(
            status_code=int(weather_response.get("cod", 400)),
            detail=weather_response.get("message", "Weather data not available")
        )
   
    # Extract only required fields
    updated_weather_data = {
        "temperature": weather_response["main"]["temp"],
        "humidity": weather_response["main"]["humidity"],
        "wind_speed": weather_response["wind"]["speed"],
        "weather_description": weather_response["weather"][0]["description"]
    }
    existing_record = weather_collection.find_one({"record_id": record_id})

    if not existing_record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Ensure we only update fields while keeping existing ones
    final_updated_data = existing_record["weather_data"]
    final_updated_data.update(updated_weather_data)  # Merge existing with new data

    update_result = weather_collection.update_one(
        {"record_id": record_id},
        {"$set": {
            "location": data.location,
            # "weather_data": weather_response
            "weather_data": final_updated_data

        }}
    )
    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": "Weather record updated"}

@router.delete("/weather/delete/{record_id}")
def delete_weather(record_id: str):
    delete_result = weather_collection.delete_one({"record_id": record_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": "Weather record deleted"}

# ✅ Export Weather Data (CSV, JSON, PDF)



@router.get("/export/{format}")
def export_weather_data(format: str):
    records = list(weather_collection.find({}, {"_id": 0}))

    if not records:
        raise HTTPException(status_code=404, detail="No weather records found")
        # return{"error": "No weather records found"}

    if format == "json":
        return records

    if format == "csv":
        df = pd.DataFrame(records)
        stream = io.StringIO()
        df.to_csv(stream, index=False)
        response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=weather_records.csv"
        return response

    if format == "pdf":
            pdf = FPDF(orientation="L", unit="mm", format="A4")  # Landscape mode
            pdf.add_page()
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, "Weather Records", ln=True, align="C")
            pdf.ln(10)

            # Extract locations (Columns)
            locations = [record["location"] for record in records]

            # Define required parameters (Rows)
            parameters = ["Temperature (°C)", "Humidity (%)", "Wind Speed (m/s)", "Weather Description", "Created Date"]

            # Define table headers (first column is 'Parameter', then locations as columns)
            headers = ["Parameter"] + locations
            column_width = 50  # Adjust width for readability
            pdf.set_fill_color(200, 200, 200)  # Gray background for headers

            # Draw Table Headers
            pdf.set_font("Arial", "B", 10)
            for header in headers:
                pdf.cell(column_width, 10, header, border=1, fill=True)
            pdf.ln()

            # Draw Table Rows (Parameters in rows, locations as columns)
            pdf.set_font("Arial", size=10)
            for param in parameters:
                pdf.cell(column_width, 10, param, border=1)  # Parameter name
                for record in records:
                    weather_data = record["weather_data"]
                    if param == "Temperature (°C)":
                        value = weather_data.get("temperature", "N/A")
                    elif param == "Humidity (%)":
                        value = weather_data.get("humidity", "N/A")
                    elif param == "Wind Speed (m/s)":
                        value = weather_data.get("wind_speed", "N/A")
                    elif param == "Weather Description":
                        value = weather_data.get("weather_description", "N/A")
                    elif param == "Created Date":
                        value = record.get("created_at", "N/A")
                    pdf.cell(column_width, 10, str(value), border=1)
                pdf.ln()  # Move to the next row

            # Convert PDF to Bytes and Send as Response
            pdf_bytes = pdf.output(dest="S").encode("latin1")
            response = StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf")
            response.headers["Content-Disposition"] = "attachment; filename=weather_records.pdf"
            return response

    raise HTTPException(status_code=400, detail="Invalid format")
