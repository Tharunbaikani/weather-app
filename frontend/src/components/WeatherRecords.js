
// ----------------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { getWeatherRecords,updateWeatherRecord, deleteWeatherRecord } from "../api";

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const WeatherRecords = () => {
  const [records, setRecords] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [updatedLocation, setUpdatedLocation] = useState("");

  

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    
    try {
      const data = await getWeatherRecords();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const handleDelete = async (recordId) => {
    await deleteWeatherRecord(recordId);
    fetchRecords();
  };

   
  const handleEdit = (record) => {
    setEditMode(record.record_id);
    setUpdatedLocation(record.location);
  };

  const handleUpdate = async (recordId) => {
    await updateWeatherRecord(recordId, updatedLocation);
    setEditMode(null);
    fetchRecords();
  };

  
  const handleExport = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/export/${format}`, {
        responseType: "blob",
      });
      const filename = `weather_records.${format}`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error.response?.data || error.message);
      alert("Export failed");
    }
  };

   

  return (
    <div>
      <h2>Saved Weather Records</h2>
      {records.map((record) => (
        <div key={record.record_id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
          <p><strong>Location:</strong> {record.location}</p>
          <p><strong>Created At:</strong> {new Date(record.created_at).toLocaleString()}</p>
          {editMode === record.record_id ? (
            <div>
              <input
                type="text"
                value={updatedLocation}
                onChange={(e) => setUpdatedLocation(e.target.value)}
                placeholder="Update location"
              />
              <button onClick={() => handleUpdate(record.record_id)}>Save</button>
              <button onClick={() => setEditMode(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <button onClick={() => handleEdit(record)}>Edit</button>
              <button onClick={() => handleDelete(record.record_id)}>Delete</button>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <h3>Export Weather Records</h3>
        <button onClick={() => handleExport("json")}>Export JSON</button>
        <button onClick={() => handleExport("csv")}>Export CSV</button>
        <button onClick={() => handleExport("pdf")}>Export PDF</button>
      </div>
    </div>
  );
};

export default WeatherRecords;
