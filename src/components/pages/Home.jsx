import { useRef, useState, useEffect } from "react";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { CiTempHigh } from "react-icons/ci";
import { FaArrowsDownToLine, FaMapPin, FaWind } from "react-icons/fa6";
import LoadingSpinner from "../reusableComponents/LoadingSpinner";
import { Link } from "react-router-dom";

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [timeData, setTimeData] = useState(null);
  const [prayerData, setPrayerData] = useState(null);
  const [hijriDate, setHijriDate] = useState("");
  const [miladiDate, setMiladiDate] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const cityInputRef = useRef(null);

  const WEATHER_KEY = "6f3637406b955c7a35f0056578b09762";
  const TIME_KEY = "PUJYO2LMQ6YZ";

  //   get user location
  const getUserLocation = async () => {
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            await getWeatherData(lat, lon);
            resolve();
          },
          async () => {
            await getCityCoords("cairo");
            resolve();
          }
        );
      });
    } else {
      await getCityCoords("cairo");
    }
  };

  //   get city coordination
  const getCityCoords = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WEATHER_KEY}&units=metric&lang=en`
      );
      const data = await response.json();
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      setCity(data.name);
      await getWeatherData(lat, lon);
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
    }
  };

  //   get weather data
  const getWeatherData = async (lat, lon) => {
    try {
      setLoading(true);

      // current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric&lang=en`
      );
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);

      //   forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_KEY}`
      );
      const forecastData = await forecastResponse.json();
      const dailyForecasts = forecastData.list.filter((entry) =>
        entry.dt_txt.includes("12:00:00")
      );
      setForecastData(dailyForecasts);

      // Time data
      const timeResponse = await fetch(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIME_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`
      );
      const timeData = await timeResponse.json();
      setTimeData(timeData);

      // Prayer times
      const prayerResponse = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`
      );
      const prayerData = await prayerResponse.json();
      setPrayerData(prayerData.data);

      // Dates
      setHijriDate(prayerData.data.date.hijri);
      setMiladiDate(prayerData.data.date.gregorian);
    } catch (err) {
      console.log("error fetching weather data :", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle city search
  const handleCitySearch = async (event) => {
    if (event.key === "Enter") {
      await getCityCoords(event.target.value);
    }
  };

  //   initialize app
  useEffect(() => {
    const initApp = async () => {
      await getUserLocation();
    };
    initApp();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const formatTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    const AmPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours} : ${minutes.toString().padStart(2, "0")} ${AmPm}`;
  };

  const formatPrayerTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const numHours = parseInt(hours);
    const AmPm = numHours >= 12 ? "PM" : "AM";
    const formattedHours = numHours % 12 || 12;
    return `${formattedHours}:${minutes} ${AmPm}`;
  };

  const prayerIcons = [
    "img/icons8-dawn-16.png",
    "img/icons8-sunrise-16.png",
    "img/icons8-midday-16.png",
    "img/icons8-afternoon-16.png",
    "img/icons8-sunset-16.png",
    "img/icons8-night-16.png",
  ];

  const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <>
      <span className="toQuran">
        <Link to={"/quran"}>
          <img src="/img/icons8-quran-65.png" loading="lazy" />
        </Link>
      </span>
      <section className="weatherApp container-fluid row justify-content-center align-items-center text-center m-0">
        {/* City Search */}
        <div className="search-container col-12">
          <input
            ref={cityInputRef}
            id="city"
            type="text"
            placeholder="search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleCitySearch}
          />
        </div>

        {/* Current Weather */}
        {weatherData && (
          <div className="current-weather col-12 gap-1 row justify-content-center align-items-center text-center">
            <h3 id="cityindicate">{weatherData.name}</h3>
            <div id="temp" className="col-lg-1 col-4  weatherCard">
              <CiTempHigh />
              <h6>{weatherData.main.temp} °C</h6>
            </div>
            <div id="airPressure" className="col-lg-1 col-4  weatherCard">
              <FaArrowsDownToLine />
              <h6>{weatherData.main.pressure} mmHG</h6>
            </div>
            <div id="windSpeed" className="col-lg-1 col-4  weatherCard">
              <FaWind />
              <h6>{weatherData.wind.speed} km/h</h6>
            </div>
            <div id="weatherDesc" className="col-lg-1 col-4  weatherCard">
              <FaMapPin />
              <h6>{weatherData.weather[0].description}</h6>
            </div>
          </div>
        )}

        {/* Current Time */}
        {timeData && (
          <div id="currTime" className="col-12 currTime">
            <h4>{formatTime(timeData.formatted)}</h4>
          </div>
        )}

        {/* Dates */}
        <div className="dates col-12 row gap-1 justify-content-center align-items-center text-center">
          {hijriDate && (
            <div id="hijriDate" className="col-12 col-lg-3 py-1 dateItem">
              <BsFillCalendarDateFill />
              {`${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`}
            </div>
          )}
          {miladiDate && (
            <div id="miladiDate" className="col-12 col-lg-3 py-1 dateItem">
              <BsFillCalendarDateFill />
              {`${miladiDate.day} ${miladiDate.month.en} ${miladiDate.year}`}
            </div>
          )}
        </div>

        {/* Weather Forecast */}
        <div className="weather-forecast col-12">
          <div
            id="weatherForecast"
            className="forecast-container gap-2 row justify-content-center align-items-center text-center"
          >
            {forecastData.map((day, index) => {
              const date = new Date(day.dt_txt);
              const formattedDate = `${date.getDate()} / ${
                date.getMonth() + 1
              }`;
              const temp = day.main.temp.toFixed(1);
              const desc = day.weather[0].description;

              return (
                <div key={index} className="forecastItem col-lg-1 col-4">
                  <span>
                    <BsFillCalendarDateFill />
                    {formattedDate}
                  </span>
                  <br />
                  <span>
                    <CiTempHigh />
                    {temp}°C
                  </span>
                  <br />
                  <span>
                    <FaMapPin /> {desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prayer Times */}
        {prayerData && (
          <div className="prayer-times col-12">
            <div
              id="prayer"
              className="prayer-container gap-2 row justify-content-center align-items-center text-center"
            >
              <h4>prayer times</h4>
              {prayers.map((prayer, index) => (
                <div key={prayer} className="prayerItem col-5 col-lg-1">
                  <img src={prayerIcons[index]} alt={prayer} /> {prayer}
                  <br />
                  {formatPrayerTime(prayerData.timings[prayer])}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
