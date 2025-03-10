
---

# Weather App ☁️☀️

![Screenshot 2025-03-10 035742](https://github.com/user-attachments/assets/477d603a-b30f-4aeb-896f-809ed1b089c0)



 A simple weather application using **React** (frontend) + **FastAPI** (backend) + **MongoDB**.  
 Quickly fetch **current weather**, a **5-day forecast**, watch **YouTube** videos for your location, and **save** your favorite weather records.



## ✨ Features

- [x] **Current Weather** – Powered by [OpenWeather API](https://openweathermap.org/).  
- [x] **5-Day Forecast** – Quickly see upcoming conditions.  
- [x] **Save, Update, Delete** Weather Records (CRUD) – Stored in MongoDB.  
- [x] **YouTube Integration** – Shows top 3 travel videos for your location.  
- [x] **Export** (JSON, CSV, PDF) – Export your saved records.  
- [x] **Geolocation** – Fetch weather based on your current position.


## ⚙️ Tech Stack

| **Category** | **Technology**        |
|--------------|-----------------------|
| **Frontend** | React                |
| **Backend**  | FastAPI (Python)     |
| **Database** | MongoDB              |
| **APIs**     | OpenWeather, YouTube |



## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Tharunbaikani/weather-app.git
cd weather-app
```

### 2. Environment Variables
Create a `.env` file (in the backend folder or project root) with:
```
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/...
```

### 3. Install & Run Backend
```bash
# Navigate to the backend folder if separate
cd backend

# (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```
 The FastAPI API is now at **http://localhost:8000**.

### 4. Install & Run Frontend
```bash
cd frontend
npm install   # or yarn
npm start     # or yarn start
```
 The React app is now at **http://localhost:3000**.



## 🌀 Usage

1. **Open** [http://localhost:3000](http://localhost:3000) in your browser.  
2. **Enter a location** (e.g., "Tokyo") and click **Get Weather**.  
3. **View** current weather + top 3 YouTube videos about "Tokyo travel."  
4. Click **Forecast Next 5 Days** to see upcoming weather.  
5. **Save** your favorite weather info (click "Save Weather").  
6. Go to **Records** page to **Edit**, **Delete**, or **Export** records.



## 🔥 API Endpoints (FastAPI)

| **Endpoint**                     | **Description**                                  |
|---------------------------------|--------------------------------------------------|
| **GET** `/api/weather`          | Get current weather + YouTube videos for a location |
| **GET** `/api/forecast`         | Get 5-day forecast for a location               |
| **POST** `/api/weather/save`    | Save a new weather record                       |
| **GET** `/api/weather-records`  | Retrieve all saved weather records              |
| **PUT** `/api/weather/update/{record_id}`   | Update the location of a record       |
| **DELETE** `/api/weather/delete/{record_id}`| Delete a record                        |
| **GET** `/api/export/{format}`  | Export records as `json`, `csv`, or `pdf`       |



## 🚀 Screenshots
![Screenshot 2025-03-10 035811](https://github.com/user-attachments/assets/fef98531-2bab-482e-9dcf-c49529260420)
![Screenshot 2025-03-10 035822](https://github.com/user-attachments/assets/f08490bd-7c9f-4bfb-afe4-186b4ef90211)







## 💡 Contributing

1. **Fork** this repo  
2. **Create** a new branch (`git checkout -b feature/awesome-feature`)  
3. **Commit** your changes (`git commit -m "Add awesome feature"`)  
4. **Push** to your fork (`git push origin feature/awesome-feature`)  
5. **Open** a Pull Request

---

**Enjoy  Weather App!** 
Made  by **Tharun Baikani** .
