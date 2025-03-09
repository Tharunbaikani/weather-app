import React from "react";

const ForecastDisplay = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  // Group forecast items by date (YYYY-MM-DD)
  const grouped = {};
  forecast.forEach((item) => {
    // item.date is expected to be in "YYYY-MM-DD HH:MM:SS" format
    const day = item.date.split(" ")[0];
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(item);
  });

  // For a given set of items, pick the forecast closest to targetHour
  const getForecastForTime = (items, targetHour) => {
    let closest = null;
    let minDiff = Infinity;
    items.forEach((item) => {
      const itemHour = new Date(item.date).getHours();
      const diff = Math.abs(itemHour - targetHour);
      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    });
    return closest;
  };

  // Get only 5 days from the grouped forecast
  const days = Object.keys(grouped).slice(0, 5);

  return (
    <div>
      <h2>5-Day Forecast</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {days.map((day) => {
          const items = grouped[day];
          const morning = getForecastForTime(items, 9);
          const afternoon = getForecastForTime(items, 15);
          const evening = getForecastForTime(items, 21);
          return (
            <div
              key={day}
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid gray",
                borderRadius: "8px",
                width: "150px",
              }}
            >
              <h4>{day}</h4>
              <div>
                <p>
                  <strong>Morning:</strong>{" "}
                  {morning ? `${morning.temp}°C` : "N/A"}
                </p>
                <p>
                  <strong>Afternoon:</strong>{" "}
                  {afternoon ? `${afternoon.temp}°C` : "N/A"}
                </p>
                <p>
                  <strong>Evening:</strong>{" "}
                  {evening ? `${evening.temp}°C` : "N/A"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastDisplay;

