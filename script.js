var cityArray = [];
getButtons()
var weatherIcon;
$("#search-button").on("click", function () {
    $(".future-weather").empty()
    $(".future-weather").attr("style", "display: block;")
    $(".current-weather").attr("style", "display: block;")
    var city = $("#city-search").val();
    cityArray.push(city)
    var cityButton = $("<button>").text(city)
    cityButton.attr("class", "city-search-button btn btn-outline-secondary")
    cityButton.attr("value", city)
    $(".city-buttons").append(cityButton)
    setButtons()
    $("#city-search").val("");

    var latLongUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyCLjaOmTbNl8M0ewJ5amY9cm6rytBGUVZM"

    $.ajax({
        url: latLongUrl,
        method: "GET"
    }).then(function (coordResponse) {
        console.log(coordResponse)
        var lat = coordResponse.results[0].geometry.location.lat
        var long = coordResponse.results[0].geometry.location.lng
        var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=927924e4c73455c7286d71a6b1b45a4c";
        $.ajax({
            url: weatherUrl,
            method: "GET"
        }).then(function (weatherResponse) {

            console.log(weatherResponse)

            dateArray = [];
            tempArray = [];

            for (var i = 0; i < 6; i++) {

                var unixTime = weatherResponse.daily[i].dt;
                var timeInMilliSeconds = unixTime * 1000;
                var date = new Date(timeInMilliSeconds);
                var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
                var month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
                var year = date.getFullYear();
                dateArray.push(month + "/" + day + "/" + year)

                var temp = weatherResponse.daily[i].temp.max
                temp = temp - 273;
                temp = temp * (9 / 5);
                temp = temp + 32;
                temp = temp.toFixed(1)
                tempArray.push(temp)

                var futureDiv = $("<div>")
                var futureDate = $("<p>").text(dateArray[i])
                var futureTemp = $("<p>").text(tempArray[i] + " F")
                var futureHumid = $("<p>").text("Humidity: " + weatherResponse.daily[i].humidity)
                var futureIconWeather = weatherResponse.daily[i].weather[0].icon
                var futureWeatherIcon = $("<img>");
                futureWeatherIcon.attr("class", "weather-icons");
                futureWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + futureIconWeather + "@2x.png");

                futureDiv.attr("class", "future-forecast")

                futureDiv.append(futureDate, futureWeatherIcon, futureTemp, futureHumid)
                $(".future-weather").append(futureDiv)


            }

            var currentDiv = $("<div>")
            var currentCityDate = $("<p>").html("<h3>" + city + " (" + dateArray[0] + ")</h3>")
            var currentTemp = $("<p>").html("<h5>Temperature: " + tempArray[0] + " F<h5>")
            var currentHumid = $("<p>").html("<h5>Humidity: " + weatherResponse.daily[0].humidity + "<h5>")
            var currentWind = $("<p>").html("<h5>Wind Speed: " + weatherResponse.daily[0].wind_speed + "<h5>")
            var currentUVI = $("<p>").html("<h5>UV Index: " + weatherResponse.daily[0].uvi + "<h5>")
            var iconWeather = weatherResponse.current.weather[0].icon
            var weatherIcon = $("<img>");
            weatherIcon.attr("class", "weather-icons");
            weatherIcon.attr("src", "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png");
            currentCityDate.append(weatherIcon);

            currentDiv.attr("class", "card-body")
            currentDiv.append(currentCityDate, currentTemp, currentHumid, currentWind, currentUVI)
            $(".current-weather").html(currentDiv)


        })
    })

})
function getButtons() {
    var storedCity = JSON.parse(localStorage.getItem("cityButtons"))
    if (storedCity) {
        for (var i = 0; i < storedCity.length; i++) {
            cityArray.push(storedCity[i])
            var storedCityButton = $("<button>").text(storedCity[i])
            storedCityButton.attr("class", "city-search-button btn btn-outline-secondary")
            storedCityButton.attr("value", storedCity[i])
            $(".city-buttons").append(storedCityButton)
        }
    }

}
function setButtons() {
    localStorage.setItem("cityButtons", JSON.stringify(cityArray))
}