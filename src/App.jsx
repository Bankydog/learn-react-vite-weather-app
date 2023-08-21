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
    const tempCelsius = temperatureCelsius(data[0].main.temp);

    switch (weatherMain) {
      case "rain":
        weatherBg = "rain";
        break;
      case "clouds":
        weatherBg = "warm";
        break;
      case "snow":
        weatherBg = "snow";
        break;
      case "mist":
        weatherBg = "mist";
        break;
      default:
        if (tempCelsius > 30) {
          weatherBg = "hot";
        } else if (tempCelsius <= 18) {
          weatherBg = "cold";
        }
    }
  }

  let imagePath = "/img/mist.png";
  const weatherMain =
    data.length > 0 ? data[0].weather[0].main.toLowerCase() : "";

  switch (weatherMain) {
    case "clouds":
      imagePath = "/imgs/clouds.png";
      break;
    case "mist":
      imagePath = "/imgs/mist.png";
      break;
    case "rain":
      imagePath = "/imgs/rain.png";
      break;
    case "snow":
      imagePath = "/imgs/snow.png";
      break;
    case "thunderstorm":
      imagePath = "/imgs/thunderstorm.png";
      break;
    case "clear":
      imagePath = "/imgs/sun.png";
      break;
    default:
      imagePath = "/imgs/mist.png";
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
                <img src={imagePath} className="weatherIcon" alt="" />
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
