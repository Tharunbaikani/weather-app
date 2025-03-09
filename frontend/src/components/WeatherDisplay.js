import React from "react";

const WeatherDisplay = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="weather-info"
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <h2>{weather.location}</h2>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Weather: {weather.weather}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.wind_speed} m/s</p>
      <img src={`http://openweathermap.org/img/wn/${weather.icon}.png`} alt="weather icon" />
       {/* YouTube Videos */}
       {weather.youtube_videos && weather.youtube_videos.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Realted YouTube Videos</h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "nowrap",       // Single row
              overflowX: "auto",        // Horizontal scroll if needed
              justifyContent: "center", // Center them horizontally
            }}
          >
          {weather.youtube_videos.map((video, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "blue" }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  width="200"
                  style={{ borderRadius: "4px" }}
                />
                <p style={{ fontSize: "0.9em" }}>{video.title}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default WeatherDisplay;


// const WeatherDisplay = ({ weather }) => {
//   if (!weather) return null;

//   return (
//     <div className="weather-info">
//       <h2>{weather.location}</h2>
//       <p>Temperature: {weather.temperature}°C</p>
//       <p>Weather: {weather.weather}</p>
//       <p>Humidity: {weather.humidity}%</p>
//       <p>Wind Speed: {weather.windSpeed} m/s</p>

//       {/* Google Maps */}
//       {/* {weather.googleMap && (
//         <div>
//           <h3>Google Maps</h3>
//           <iframe src={weather.googleMap} width="400" height="300" style={{ border: "0" }} allowFullScreen></iframe>
//         </div>
//       )} */}

//       {/* YouTube Videos */}
//       {weather.youtubeVideos && weather.youtubeVideos.length > 0 && (
//         <div>
//           <h3>YouTube Videos</h3>
//           {weather.youtubeVideos.map((video, index) => (
//             <div key={index}>
//               <a href={video.url} target="_blank" rel="noopener noreferrer">
//                 <img src={video.thumbnail} alt={video.title} width="200" />
//                 <p>{video.title}</p>
//               </a>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Wikipedia Summary */}
//       {weather.wikipediaSummary && (
//         <div>
//           <h3>About {weather.location}</h3>
//           <p>{weather.wikipediaSummary}</p>
//           <a href={weather.wikipediaURL} target="_blank" rel="noopener noreferrer">
//             Read more on Wikipedia
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WeatherDisplay;

