$(document).ready(function () { });

//Testing moment.js - Copy Pasta from Day planner 
console.log("Current Date", moment().format("MMMM Do YYYY"));
console.log("Current Time", moment().format('HH:mm:ss'));
var currentDate = moment().format("MMMM Do YYYY");
var currentMonth = moment().format("MMMM");
var currentDay = moment().format("D");
var currentYear = moment().format("YYYY");
//console.log(currentMonth);
//console.log(currentDay);
//console.log(currentYear);


//Creating variable for various inputs and divs
var cityInput = $("#cityInput");
var search = $("#searchButton");
var clear = $("#clearHistory");

var cityName = $("#cityName");
var currentImg = $("#currentWeatherImg");

var currentTemp = $("#temperature");
var currentHumidity = $("#humidity");
var currentWind = $("#windSpeed");
var currentUV = $("#UV-index");

var historyContainer = $("history");
var prevSearches = JSON.parse(localStorage.getItem("searchStorage")) || [];
console.log(prevSearches);

//I need to start utilizing const and let more often 
const apiKey = "db061fe7d0871f44935a08bd4577cbba";

//Ajax call to OpenWeatherMap (Current day weather)
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        //Adds city name and weather image into corresponding Div
        cityName.html("<h3>" + response.name + " - " + currentDate + "</h3>");
        var weatherPic = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
        currentImg.attr("src", weatherPic);
        //Temperature, humidity, and wind speed in their own Div
        currentTemp.html("Temperature " + KtoF(response.main.temp) + " &#176F");
        currentHumidity.html("Humidity: " + response.main.humidity + "%");
        currentWind.html("Wind Speed: " + response.wind.speed + " MPH");

        //UV Index, creating variable for longitude and latitude
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var UVQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: UVQueryURL,
            methord: "GET"
        }) .then(function (response){
            currentUV.html("UV Index = " + response.value);
        })
        //5 Day forecast
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;
        console.log(forecastQueryURL);


    })
}
// Function to convert Kelvin to Farenheit
function KtoF(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

//Click event for the search button
search.on("click", function (){
    //var userinput = cityInput.value;    --- Does not work ************
    var userInput = document.getElementById("cityInput").value;
    getWeather(userInput);
    prevSearches.push(userInput);
    localStorage.setItem("searchStorage", JSON.stringify(prevSearches));
    renderHistory();
})

//Generating History Container
function renderHistory() {
    
    for (let i=0; i < prevSearches.length; i++) {
        var historyInput = $("<input>");
        historyInput.attr("type", "text");
        historyInput.attr("readonly", true);
        historyInput.attr("class", "form-control d-block text-white");
        historyInput.attr("value", prevSearches[i]);
        historyInput.on("click", function(){
            getWeather(historyInput.value);
        })
        historyContainer.append(historyInput);
    }

}
