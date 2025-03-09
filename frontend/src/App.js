import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Records from "./pages/Records";
import "./App.css";

function App() {
  return (
    <Router>
      <nav>
        {/* <Link to="/">Home</Link>
        <Link to="/records">Records</Link> */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/records" element={<Records />} />
      </Routes>
    </Router>
  );
}

export default App;
