

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

//  Fetch current weather 
export const fetchWeather = async (location) => {
  try {
    const response = await axios.get(`${API_URL}/weather`, { params: { location } });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Weather data not available");
  }
};

//  Fetch 5-day forecast
export const fetchForecast = async (location) => {
  try {
    const response = await axios.get(`${API_URL}/forecast`, { params: { location } });
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Forecast data not available");
  }
};

//  Fetch weather based on user's geolocation (latitude & longitude)
export const fetchGeolocationWeather = async (lat, lon) => {
  try {
    const response = await axios.get(`${API_URL}/weather`, { params: { location: `${lat},${lon}` } });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather from geolocation:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Geolocation weather not available");
  }
};

//  CRUD Functions (Database Operations)


export const saveWeatherRecord = async (location) => {
  const response = await axios.post(`${API_URL}/weather/save`, {
    location
    
  });
  return response.data;
};

// Get all stored weather records
export const getWeatherRecords = async () => {
  const response = await axios.get(`${API_URL}/weather-records`);
  return response.data;
};

// Update a weather record (with new temperature)
export const updateWeatherRecord = async (recordId,location) => {
  const response = await axios.put(`${API_URL}/weather/update/${recordId}`, {
    location
    
  });
  return response.data;
};




// Delete a weather record
export const deleteWeatherRecord = async (recordId) => {
  const response = await axios.delete(`${API_URL}/weather/delete/${recordId}`);
  return response.data;
};
