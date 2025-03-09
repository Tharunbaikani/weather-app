// src/pages/Records.js
import React from "react";
import WeatherRecords from "../components/WeatherRecords";
import { Link } from "react-router-dom";

const Records = () => {
  // return (
  //   <div>
  //     <h1>Saved Weather Records</h1>
  //     <WeatherRecords />
  //   </div>
  // );

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Navbar */}
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
      </div>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1></h1>
        <WeatherRecords />
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
          title="Product Manager Accelerator is a global community dedicated to empowering product managers through training, networking, and career development. Visit our LinkedIn page for more details."
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

export default Records;
