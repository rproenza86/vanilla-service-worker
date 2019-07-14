window.addEventListener("load", () => {
    document.querySelector("ul#weather").innerHTML = "";
    Promise.all([fetchWeather("san diego"), fetchWeather("sacramento"), fetchWeather("fresno")])
        .then(responses => {
            responses.forEach(response => {
                response.json()
                    .then(data => {
                        let li;
                        if (data[0].error) {
                            li = `<li>Offline<li>`;
                        } else {
                            li = `<li>${data[0].name}: 
                                ${Math.round(data[0].forecast[0].temp_min)}F -
                                ${Math.round(data[0].forecast[0].temp_max)}F</li>`;
                        }
                        document.querySelector("ul#weather").innerHTML += li;
                    })
            })
        })
});

function fetchWeather(city) {
    return fetch("http://explorecalifornia.org/api/weather/?city=" + encodeURIComponent(city));
}