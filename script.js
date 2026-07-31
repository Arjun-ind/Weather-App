const apiKey = weatherApiKey;


const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const locationBtn = document.getElementById("locationBtn");

const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const city = document.getElementById("city");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");

const forecastContainer =
document.getElementById("forecastContainer");

const loader =
document.getElementById("loader");

const errorMessage =
document.getElementById("errorMessage");


// ==============================
// LOADER
// ==============================

function showLoader(){

    if(loader){
        loader.style.display="block";
    }

}

function hideLoader(){

    if(loader){
        loader.style.display="none";
    }

}


// ==============================
// BACKGROUND
// ==============================

function changeBackground(weather){

    switch(weather){

        case "Clear":
            document.body.style.background =
            "linear-gradient(135deg,#4facfe,#00f2fe)";
            break;

        case "Clouds":
            document.body.style.background =
            "linear-gradient(135deg,#757f9a,#d7dde8)";
            break;

        case "Rain":

        case "Drizzle":
            document.body.style.background =
            "linear-gradient(135deg,#314755,#26a0da)";
            break;

        case "Thunderstorm":
            document.body.style.background =
            "linear-gradient(135deg,#232526,#414345)";
            break;

        case "Snow":
            document.body.style.background =
            "linear-gradient(135deg,#E6DADA,#274046)";
            break;

        default:
            document.body.style.background =
            "linear-gradient(135deg,#667eea,#764ba2,#43cea2)";

    }

}



// ==============================
// UPDATE UI
// ==============================

function updateUI(data){

    city.innerHTML =
    `${data.name}, ${data.sys.country}`;

    temperature.innerHTML =
    `${Math.round(data.main.temp)}°C`;

    description.innerHTML =
    data.weather[0].description;

    humidity.innerHTML =
    `${data.main.humidity}%`;

    wind.innerHTML =
    `${data.wind.speed} km/h`;

    feelsLike.innerHTML =
    `${Math.round(data.main.feels_like)}°C`;

    visibility.innerHTML =
    `${data.visibility / 1000} km`;

    weatherIcon.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    changeBackground(
        data.weather[0].main
    );

}


// ==============================
// UPDATE FORECAST
// ==============================

function updateForecast(data){

    forecastContainer.innerHTML = "";

    const dailyForecast = [];

    data.list.forEach((item)=>{

        if(item.dt_txt.includes("12:00:00")){

            dailyForecast.push(item);

        }

    });


    dailyForecast.forEach((day)=>{

        const date =
        new Date(day.dt_txt);

        const dayName =
        date.toLocaleDateString("en-US",{
            weekday:"short"
        });

        const icon =
        day.weather[0].icon;

        const temp =
        Math.round(day.main.temp);

        const weather =
        day.weather[0].main;

        const card =
        document.createElement("div");

        card.classList.add("forecast-card");

        card.innerHTML = `

            <p>${dayName}</p>

            <img
            src="https://openweathermap.org/img/wn/${icon}@2x.png"
            alt="Weather Icon">

            <h4>${temp}°C</h4>

            <small>${weather}</small>

        `;

        forecastContainer.appendChild(card);

    });

}



// ==============================
// GET FORECAST BY CITY
// ==============================

async function getForecast(cityName){

    try{

        const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;

        const response =
        await fetch(url);

        if(!response.ok){

            throw new Error("Forecast not found");

        }

        const data =
        await response.json();

        updateForecast(data);

    }

    catch(error){

        console.log(error.message);

    }

}



// ==============================
// GET FORECAST BY LOCATION
// ==============================

async function getForecastByLocation(lat, lon){

    try{

        const url =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response =
        await fetch(url);

        if(!response.ok){

            throw new Error("Forecast not found");

        }

        const data =
        await response.json();

        updateForecast(data);

    }

    catch(error){

        console.log(error.message);

    }

}


// ==============================
// GET WEATHER BY CITY
// ==============================

async function getWeather(cityName){

    try{

        showLoader();

        errorMessage.innerHTML = "";

        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;

        const response =
        await fetch(url);

        if(!response.ok){

            throw new Error("City not found");

        }

        const data =
        await response.json();

        hideLoader();

        updateUI(data);

        // Load 5-Day Forecast
        getForecast(cityName);

    }

    catch(error){

        hideLoader();

        errorMessage.innerHTML =
        error.message;

    }

}



// ==============================
// GET WEATHER BY LOCATION
// ==============================

async function getWeatherByLocation(lat, lon){

    try{

        showLoader();

        errorMessage.innerHTML = "";

        const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response =
        await fetch(url);

        if(!response.ok){

            throw new Error("Unable to fetch weather");

        }

        const data =
        await response.json();

        hideLoader();

        updateUI(data);

        // Load 5-Day Forecast
        getForecastByLocation(lat, lon);

    }

    catch(error){

        hideLoader();

        errorMessage.innerHTML =
        error.message;

    }

}



// ==============================
// SEARCH BUTTON
// ==============================

searchBtn.addEventListener("click", () => {

    const cityName = cityInput.value.trim();

    if(cityName !== ""){

        getWeather(cityName);

    }

});



// ==============================
// ENTER KEY SEARCH
// ==============================

cityInput.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        const cityName = cityInput.value.trim();

        if(cityName !== ""){

            getWeather(cityName);

        }

    }

});



// ==============================
// CURRENT LOCATION
// ==============================

locationBtn.addEventListener("click", () => {

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const lat = position.coords.latitude;

                const lon = position.coords.longitude;

                getWeatherByLocation(lat, lon);

            },

            () => {

                errorMessage.innerHTML =
                "Location permission denied.";

            }

        );

    }

    else{

        errorMessage.innerHTML =
        "Geolocation is not supported by this browser.";

    }

});



// ==============================
// DEFAULT WEATHER ON PAGE LOAD
// ==============================

window.addEventListener("load", () => {

    getWeather("Palakkad");

});