from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.weather_routes import router as weather_router
import uvicorn


app = FastAPI(title="Weather App API")
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="frontend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)

@app.get("/")
def home():
    return {"message": "Welcome to the FastAPI Weather App"}





if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
