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

  let weatherBg = "";

  if (data.length > 0) {
    const weatherMain = data[0].weather[0].main.toLowerCase();
    const tempCelsius = temperatureCelsius(data[0].main.temp);

    weatherBg =
      weatherMain === "rain" || weatherMain === "thunderstorm"
        ? "rain"
        : weatherMain === "clouds" && tempCelsius <= 30 && tempCelsius > 18
        ? "warm"
        : weatherMain === "clouds" && tempCelsius < 10
        ? "snow"
        : weatherMain === "snow"
        ? "snow"
        : weatherMain === "mist"
        ? "mist"
        : tempCelsius > 33
        ? "hot"
        : tempCelsius <= 18
        ? "cold"
        : "warm";
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
          <div className="dropdown"></div>
        </form>
        {data.map((item, index) => (
          <index key={index} className="location-container">
            <div className="wrapper">
              <div className="location">
                {item.name}, {item.sys.country}
              </div>
              <div className="date">{new Date().toDateString()}</div>
              <div className="weather-container">
                <div className="temperature">
                  {temperatureCelsius(item.main.temp)}°C
                </div>
                <div className="containerTemp">
                  <div className="wrapperTemp">
                    <img
                      src="/imgs/temp_cold.png"
                      className="tempIcon"
                      alt="temp_cold"
                    />
                    <span className="tempMinMax">
                      {temperatureCelsius(item.main.temp_min)}°C
                    </span>
                  </div>
                  <div className="wrapperTemp">
                    <img
                      src="/imgs/temp_hot.png"
                      className="tempIcon"
                      alt="temp_cold"
                    />
                    <span className="tempMinMax">
                      {temperatureCelsius(item.main.temp_max)}°C
                    </span>
                  </div>
                </div>
                <div>
                  <img
                    src={imagePath}
                    className="weatherIcon"
                    alt={item.weather[0].main}
                  />
                </div>
                <div className="weather">{item.weather[0].main}</div>
                <div className="containerSun">
                  <div className="wrapperSunRiseSet">
                    <img
                      src="/imgs/sunrise.png"
                      className="sunRiseSetIcon"
                      alt="sunrise"
                    />
                    <span className="sunRiseSet">
                      {new Date(item.sys.sunrise * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="wrapperSunRiseSet">
                    <img
                      src="/imgs/sunset.png"
                      className="sunRiseSetIcon"
                      alt="sunset"
                    />
                    <span className="sunRiseSet">
                      {new Date(item.sys.sunset * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </index>
        ))}
      </main>
    </div>
  );
}

export default App;
