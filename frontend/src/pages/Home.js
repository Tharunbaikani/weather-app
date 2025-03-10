
import React, { useState } from "react";
import WeatherForm from "../components/WeatherForm";
import WeatherDisplay from "../components/WeatherDisplay";
import ForecastDisplay from "../components/ForecastDisplay";
import {
  fetchWeather,
  fetchForecast,
  fetchGeolocationWeather,
  saveWeatherRecord,
} from "../api";
import { Link } from "react-router-dom";


const Home = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  // Fetch current weather data only
  const handleSearch = async (location) => {
    try {
      setError("");
      const weatherData = await fetchWeather(location);
      setWeather(weatherData);
      
      // Clear any previous forecast
      setForecast([]);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Error fetching weather data. Please check the location.");
      setWeather(null);
      setForecast([]);
    }
  };

  // Fetch forecast data when user clicks "Forecast Next 5 Days"
  const handleForecast = async (location) => {
    try {
      const forecastData = await fetchForecast(location);
      setForecast(forecastData.forecast);
    } catch (err) {
      console.error("Error fetching forecast:", err);
      setError("Error fetching forecast data.");
    }
  };

  // Get weather based on user's geolocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setError("");
          const { latitude, longitude } = position.coords;
          const weatherData = await fetchGeolocationWeather(latitude, longitude);
          setWeather(weatherData);
          
          setForecast([]);
        } catch (err) {
          console.error("Error fetching weather from geolocation:", err);
          setError("Failed to fetch weather from location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to retrieve your location.");
      }
    );
  };

  // Save weather data (CRUD - create) remains unchanged
  const handleSaveWeather = async (location) => {
    try {
      await saveWeatherRecord(location);
      alert("Weather record saved successfully!");
    } catch (err) {
      // console.error("Error saving weather record:", err);
      // alert("Failed to save weather record.");
      console.error("Error saving weather record:", err.response?.data || err.message);
      // alert(`Failed to save weather record: ${err.response?.data?.detail || err.message}`);
      // Convert error detail to a string for display
      const errorDetail = err.response?.data?.detail;
      const errorMsg =
       typeof errorDetail === "object"
         ? JSON.stringify(errorDetail)
         : errorDetail || err.message;
      alert(`Failed to save weather record: ${errorMsg}`);
    }

  };

  // return (
  //   <div>
  //     <h1>Weather App</h1>
  //     <WeatherForm onSearch={handleSearch} onSave={handleSaveWeather} />
  //     <button onClick={handleGeolocation}>Use My Location</button>

  //     {error && <p className="error">{error}</p>}

  //     <WeatherDisplay weather={weather} />

  //     {weather && (
  //       <button onClick={() => handleForecast(weather.location)}>
  //         Forecast Next 5 Days
  //       </button>
  //     )}

  //     {forecast.length > 0 && <ForecastDisplay forecast={forecast} />}
  //   </div>
  // );

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
     
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              marginRight: "20px",
              textDecoration: "none",
              color: "black",
              fontSize: "18px",
            }}
          >
            Home
          </Link>
          <Link
            to="/records"
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "18px",
            }}
          >
            Records
          </Link>
        </div>
        <button
          onClick={() => weather && handleSaveWeather(weather.location)}
          style={{
            backgroundColor: "black",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save Weather
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <WeatherForm onSearch={handleSearch} onSave={handleSaveWeather} />
        </div>
        <button
          onClick={handleGeolocation}
          style={{
            marginTop: "20px",
            backgroundColor: "transparent",
            color: "black",
            border: "2px solid black",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Use My Location
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "20px" }}>
            {error}
          </p>
        )}

        {weather && (
          <div style={{ marginTop: "40px", width: "80%" }}>
            <WeatherDisplay weather={weather} />
            <button
              onClick={() => handleForecast(weather.location)}
              style={{
                marginTop: "20px",
                backgroundColor: "lightblue",
                color: "black",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Forecast Next 5 Days
            </button>
          </div>
        )}

        {forecast.length > 0 && (
          <div style={{ marginTop: "20px", width: "80%" }}>
            <ForecastDisplay forecast={forecast} />
          </div>
        )}
        
      </div>
       {/* Footer at Bottom Right */}
       <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          fontSize: "20px",
          color: "black",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold"
          
        }}
      >
        Tharun Baikani
        <span
          title="PM Accelerator is a US based company with a global reach premiering in AI learning and as a development hub, featuring award-winning AI products and mentors from top-tier companies such as Google, Meta, Apple, and Nvidia. We offer a dynamic AI PM Bootcamp, designed to empower the next generation of AI professionals through hands-on experience, mentorship, and real-world projects."
          style={{
            display: "inline-block",
            marginLeft: "8px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "1px solid gray",
            textAlign: "center",
            lineHeight: "20px",
            cursor: "default",
            fontSize: "12px",
          }}
        >
          i
        </span>
      </div>
    </div>
  );

};

export default Home;
