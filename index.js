const apiKey = API_KEY;

// Fetch forecast
async function fetchWeather(city = "Mumbai") {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`
    );
    const data = await response.json();
    updateUI(data);
    renderForecast(data.forecast.forecastday);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Main Dashboard
function updateUI(data) {
  document.getElementById("displayCity").innerHTML = `${data.location.name}, ${data.location.country} <span>${data.location.localtime}</span>`;
  document.getElementById("temperature").textContent = `Temperature: ${data.current.temp_c}°C`;
  document.getElementById("wind").textContent = `Wind: ${data.current.wind_kph} kph`;
  document.getElementById("humidity").textContent = `Humidity: ${data.current.humidity}%`;
  document.getElementById("weatherIcon").src = `https:${data.current.condition.icon}`;
  document.getElementById("conditionText").textContent = data.current.condition.text;
}

// Render 5-day forecast card
function renderForecast(forecastDays) {
  const container = document.getElementById("forecastContainer");
  container.innerHTML = ""; 

  forecastDays.forEach(day => {
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p><strong>${day.date}</strong></p>
      <img src="https:${day.day.condition.icon}" alt="weather icon" />
      <p>🌡️ ${day.day.avgtemp_c}°C</p>
      <p>💨 ${day.day.maxwind_kph} kph</p>
      <p>💧 ${day.day.avghumidity}%</p>
    `;
    container.appendChild(card);
  });
}

// Search button
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

// Current location button
document.getElementById("locBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      fetchWeather(coords);
    }, () => {
      alert("Location access denied.");
    });
  } else {
    alert("Geolocation is not supported.");
  }
});

// Initial load
fetchWeather("Mumbai");
