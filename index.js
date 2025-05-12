const apiKey = API_KEY;

const recentCitiesSelect = document.getElementById("recentCities");

// Load from localStorage
let searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

// Populate dropdown from stored cities
function populateDropdown() {
  recentCitiesSelect.innerHTML = `<option value="" disabled selected>Select a previously searched city</option>`;
  searchedCities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    recentCitiesSelect.appendChild(option);
  });
}

// Add new city to localStorage and dropdown
function addCityToDropdown(city) {
  if (!searchedCities.includes(city)) {
    searchedCities.push(city);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    populateDropdown();
  }
}

// Fetch forecast
async function fetchWeather(city = "Mumbai") {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`
    );
    const data = await response.json();
    updateUI(data);
    renderForecast(data.forecast.forecastday);
    addCityToDropdown(data.location.name); // Save after successful fetch
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

// Render 5-day forecast cards
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

// Event: Dropdown select
recentCitiesSelect.addEventListener("change", function () {
  const selectedCity = this.value;
  if (selectedCity) {
    fetchWeather(selectedCity);
  }
});

// Initial load
populateDropdown();
fetchWeather("Mumbai");
