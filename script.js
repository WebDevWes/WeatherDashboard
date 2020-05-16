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
var inputGroup = $("#input-group");

var cityName = $("#cityName");
var currentImg = $("#currentWeatherImg");

var currentTemp = $("#temperature");
var currentHumidity = $("#humidity");
var currentWind = $("#windSpeed");
var currentUV = $("#UV-index");

var historyContainer = $("#history");
var prevSearches = JSON.parse(localStorage.getItem("searchStorage")) || [];
//console.log(prevSearches);
//Call renderHistory function here to bring out prevSearches
renderHistory();
getLocation();

//Attempting to add getCurrentPosition() --- COPY PASTA FROM WEEK 3 ASSIGNMENT - locationredirect
function getLocation() {
    if (navigator.geolocation) {
        // Provide our showPosition() function to getCurrentPosition
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}
// This will get called after getCurrentPosition()
function showPosition(position) {
    // Grab coordinates from the given object
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    //console.log("Your coordinates are Latitude: " + lat + " Longitude " + lon);
    var locationQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    //console.log(locationQueryURL)
}

//I need to start utilizing const and let more often 
const apiKey = "db061fe7d0871f44935a08bd4577cbba";

//Ajax call to OpenWeatherMap (Current day weather)
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //console.log(response);
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
            method: "GET"
        }).then(function (response) {
            //console.log(response);
            currentUV.html("UV Index = " + response.value);
            //Changing color of badge depending on UV Index value
            if (response.value >= 8) {
                currentUV.attr("class", "badge badge-danger");
            }
            if (response.value >= 6 && response.value < 8) {
                currentUV.attr("class", "badge badge-warning");
            }
            if (response.value < 6) {
                currentUV.attr("class", "badge badge-success");
            }
            if (response.value < 3) {
                currentUV.attr("class", "badge badge-info");
            }

        })
        //5 Day forecast --- This is giving me a ton of warnings on the console about (dt_txt)
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        }).then(function (response) {
            //console.log(response);
            var dayNum = 1;
            for (let i = 0; response.list.length; i++) {
                if (response.list[i].dt_txt.split(" ")[1] == "15:00:00") {
                    let day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                    let month = response.list[i].dt_txt.split("-")[1];
                    $("#day" + dayNum).text(month + "/" + day);
                    var temp = KtoF(response.list[i].main.temp);
                    $("#day" + dayNum + "-temp").html("Temp: " + temp + "&#176F");
                    $("#day" + dayNum + "-humidity").text("Humidity: " + response.list[i].main.humidity);
                    $("#day" + dayNum + "-icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    dayNum++;
                }
            }
        })
    })
}
// Function to convert Kelvin to Farenheit
function KtoF(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

//Click event for the search button
search.on("click", function () {
    var userInput = cityInput.val().trim();
    getWeather(userInput);
    prevSearches.push(userInput);
    localStorage.setItem("searchStorage", JSON.stringify(prevSearches));
    renderHistory();
    cityInput.val("");
    //inputGroup.reset();

})

//Generating History Container
function renderHistory() {
    historyContainer.empty();

    for (let i = 0; i < prevSearches.length; i++) {
        var historyInput = $("<input>");
        historyInput.attr("type", "text");
        historyInput.attr("readonly", true);
        historyInput.attr("class", "form-control-lg text-black");
        historyInput.attr("value", prevSearches[i]);
        historyInput.on("click", function () {
            getWeather($(this).attr("value"));
        })
        historyContainer.append(historyInput);
    }

}

//Button to clear array 
clear.on("click", function () {
    localStorage.removeItem("searchStorage");
    prevSearches.length = 0;
    //historyContainer.reset();
    renderHistory();
})
