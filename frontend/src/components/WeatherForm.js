
import React, { useState } from "react";

const WeatherForm = ({ onSearch, onSave }) => {
  const [location, setLocation] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    onSearch(location);
  };

  

  // const handleSave = () => {
  //   if (!location.trim()) return;
  //   onSave(location);
  // };

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <input
  //       type="text"
  //       value={location}
  //       onChange={(e) => setLocation(e.target.value)}
  //       placeholder="Enter location (City, Zip, Coordinates, etc.)"
  //     />
  //     <button type="submit">Get Weather</button>
  //     <button type="button" onClick={handleSave}>
  //       Save Weather
  //     </button>
  //   </form>
  // );
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter a location"
        style={{
          padding: "10px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginRight: "10px",
        }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Get Weather
      </button>
    </form>
  );

  
};

export default WeatherForm;
