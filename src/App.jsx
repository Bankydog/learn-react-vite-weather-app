import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=b247d7dafdf548ba82f8837ec8752d4a`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchWeatherData();
    setLocation("");
  };

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(url);
      setData([response.data]);
      console.log(response);
    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
  };

  const temperatureCelsius = (temp) => (temp - 273.15).toFixed(1);

  let weatherBg = ""; // Declare weatherBg here

  if (data.length > 0) {
    const weatherMain = data[0].weather[0].main.toLowerCase();
    if (weatherMain === "rain") {
      weatherBg = "rain";
    } else if (weatherMain === "clouds") {
      weatherBg = "warm";
    } else if (weatherMain === "snow") {
      weatherBg = "snow";
    } else if (weatherMain === "mist") {
      weatherBg = "mist";
    } else if (temperatureCelsius(data[0].main.temp) > 18) {
      weatherBg = "hot";
    } else if (temperatureCelsius(data[0].main.temp) <= 18) {
      weatherBg = "cold";
    }
  }

  return (
    <div className={`app ${weatherBg}`}>
      <main>
        <form className="search-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
        </form>
        {data.map((item, index) => (
          <div key={index} className="location-container">
            <div className="wrapper">
              <div className="location">
                {item.name}, {item.sys.country}
              </div>
              <div className="date">{new Date().toDateString()}</div>
              <div className="weather-container">
                <div className="temperature">
                  {temperatureCelsius(item.main.temp)}°C
                </div>
                <img
                  src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                  className="weatherIcon"
                  alt=""
                />
                <div className="weather">{item.weather[0].main}</div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
