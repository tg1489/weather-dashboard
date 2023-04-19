$(function () {


    const
        results = $("#results"), // Displays results
        search = $("#search"), // Search input field
        historyEl = $("#history-id"), // History element
        fiveDayEl = $('#5-day'), // Five day forecast element div
        id = localStorage.length + 1; // ID for localStorage

    $('#h3-id').text(dayjs().format('MMMM DD, YYYY'));


    // Button Click event
    $("#btn").on("click", (e) => {
        e.preventDefault();
        $('div.card-2').css('padding', '21px 0')
        const
            apiKey = "6513fb31ba384f9391f06324986c1880",
            city = search.val(),
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        // Api Fetch
        fetch(url)
        .then(res => res.json())
        .then((data) => {

console.log(data);

            let

                cityID = data.city.id, // City ID
                cityName = data.city.name, // City Name
                todaysDate = dateConverter(data.list[4].dt_txt.slice(0,10)),  // Current Date
                currentTemp = fahrenheitConverter(data.list[4].main.temp), // Current Weather T
                currentHumidity = data.list[4].main.humidity, // Current Humidity
                currentWindSpeed = data.list[4].wind.speed; // Current Wind Speed

                results.html(`
                            <div">
                             <h2 class="text-center">Current Day - <span>(${todaysDate})</span></h2>
                                <h4>${cityName}  </h4>
                                <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" alt="weather icon" title="icon">
                                <br> Temp: ${currentTemp}&#176; <br> Wind: ${currentWindSpeed} MPH
                                <br> Humidity: ${currentHumidity}%
                            <div>
                                    `)



          fiveDayEl.html(`
          <h3 class="text-center">Five-Day Forecast</h3>
          <div class="container">
            <div class="row-card-1 row align-items-center shadow-lg" style="border-radius: 10px; border-style: solid; border-color: rgba(83,83,83,0.16)">
              ${[0, 6, 14, 22, 30].map(i => `
                <div class="col" style="padding: 1rem;">
                  <h6><span>${dayConverter(data.list[i].dt_txt)}</span> </h6>
                  <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather icon" title="icon">
                  <br> Temp: ${fahrenheitConverter(data.list[i].main.temp)}&#176; <br> Wind: ${data.list[i].wind.speed} MPH
                  <br> Humidity: ${data.list[i].main.humidity}%
                </div>
              `).join('')}
            </div>
          </div>
        `);


          // Check if data already exists in localStorage
          let isDuplicate = false;
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const data = JSON.parse(localStorage.getItem(key));
            if (data.cityID === cityID) {
              isDuplicate = true;
              break;
            }
          }

          if (!isDuplicate) {
            // Add data to localStorage
            localStorage.setItem(`city-${id}`, JSON.stringify({
              cityID: cityID,
              cityName: cityName,
              todaysDate: todaysDate
            }));
          }

        })
        .catch(error => console.error("Request failed", error))
        search.val('');
    })


  // Filter out duplicate data from localStorage
  const filteredData = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const data = JSON.parse(localStorage.getItem(key));
    if (!filteredData.some(item => item.cityID === data.cityID)) {
      filteredData.push(data);
    }
  }

  // Display filteredData in search results
  if (localStorage.length > 0) {
    let
      searchEl = '';

    for (let i = 0; i < localStorage.length; i++) {
      searchEl += `<a id="local-storage-id-${i}" href="#"><div style="background-color: rgba(85,85,85,0.35);">${filteredData[i].cityName}</div></a>`
      historyEl.html(searchEl);
    }
  }

  // Search History Click Event
  historyEl.click((e) => {
    let cityClickedOn = e.target.childNodes[0].data;

    if (historyEl.children().length > 0) {
      const
        apiKey = "6513fb31ba384f9391f06324986c1880";
        // storageCity = localStorage.key(e);


      url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityClickedOn}&appid=${apiKey}`;

      fetch(url)
        .then(res => res.json())
        .then((data) => {

          let
            cityName = data.city.name, // City Name
            todaysDate = dateConverter(data.list[4].dt_txt.slice(0,10)),  // Current Date
            currentTemp = fahrenheitConverter(data.list[4].main.temp), // Current Weather T
            currentHumidity = data.list[4].main.humidity, // Current Humidity
            currentWindSpeed = data.list[4].wind.speed; // Current Wind Speed




          results.html(`
                            <div">
                             <h2 class="text-center">Current Day - <span>(${todaysDate})</span></h2>
                                <h4>${cityName}  </h4>
                                <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" alt="weather icon" title="icon">
                                <br> Temp: ${currentTemp}&#176; <br> Wind: ${currentWindSpeed} MPH
                                <br> Humidity: ${currentHumidity}%
                            <div>
                                    `)



          fiveDayEl.html(`
          <h3 class="text-center">Five-Day Forecast</h3>
          <div class="container">
            <div class="row-card-1 row align-items-center shadow-lg" style="border-radius: 10px; border-style: solid; border-color: rgba(83,83,83,0.16)">
              ${[0, 6, 14, 22, 30].map(i => `
                <div class="col" style="padding: 1rem;">
                  <h6><span>${dayConverter(data.list[i].dt_txt)}</span> </h6>
                  <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather icon" title="icon">
                  <br> Temp: ${fahrenheitConverter(data.list[i].main.temp)}&#176; <br> Wind: ${data.list[i].wind.speed} MPH
                  <br> Humidity: ${data.list[i].main.humidity}%
                </div>
              `).join('')}
            </div>
          </div>
        `);

        }).catch()
    }
  })

  // Convert Temp
    function fahrenheitConverter (k) {
      const f = Math.round((k - 273.15) * 1.8 + 32);

      return f;
    }

    // Convert Date
    function dateConverter (date) {
        let myDate = new Date(date);
        let formattedDate = `${myDate.getMonth() + 1}/${myDate.getDate()}/${myDate.getFullYear()}`;

        return formattedDate;
    }

    // Convert Day
    function dayConverter (day) {
          let formattedDate = dayjs(day).format('dddd');

      return formattedDate;
    }

})
