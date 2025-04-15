


// import { apiKey } from './config.js';
(function initWeatherApp () {
   
    // get the elements
    let myInput = document.querySelector('#city-input')
    let mainBtn = document.querySelector("#get-weather-btn")
    // let apiKey = 'fea95e316e35e297ebcdf58e6e960af4'
    let cityName = document.querySelector('#city-name')
    let temperature = document.querySelector('#temperature')
    let description = document.querySelector("#description")
    let humidity = document.querySelector("#humidity")
    let weatherCard = document.querySelector(".weather-card")
    let errorMessage = document.querySelector("#error-message")
    let weatherImg = document.querySelector('.weather-img')
    let time = document.querySelector('#time')
    let share = document.querySelector("#shareBtn")
    let encodedMsg = ''
    const apiKey = 'fea95e316e35e297ebcdf58e6e960af4'; // مؤقت لحل الخطأ


       // check if the elements don't existing return null and stop the code
    if (!cityName || !temperature || !description || !humidity 
        || !weatherCard || !myInput || !mainBtn || 
        !weatherImg || !errorMessage || !share || !time) {
                return;  
    }

    window.onload = function () {
        myInput.focus()
       
    }
    

    // Define background styles for different weather conditions
    const weatherBackgrounds = {
        Clear: 'linear-gradient(to bottom, #87CEEB, #4682B4)', 
        Clouds: 'linear-gradient(to bottom, #B0C4DE, #778899)', 
        Rain: 'linear-gradient(to bottom, #4682B4, #2F4F4F)', 
        Snow: 'linear-gradient(to bottom, #F5F6F5, #D3D3D3)', 
        Thunderstorm: 'linear-gradient(to bottom, #4B0082, #191970)', 
        Mist: 'linear-gradient(to bottom, #D3D3D3, #A9A9A9)', 
        Default: 'url(/weatherImg.jpg)' 
       
    };

        // Starting to fetch the data 
        function fetchData () {

            if (myInput.value.trim() == "") {

                // Add input animation
                myInput.classList.add('shake')

                // remove the animation class so it can be trigger again 
                setTimeout(() => {
                    myInput.classList.remove('shake');
                  }, 400);

                // check if the card is already existing remove it and show error msg only
                weatherCard.classList.add('hidden')
                errorMessage.textContent = 'Please Enter the city name'
                cityName.textContent = ''
                temperature.textContent = ''
                description.textContent = ''
                humidity.textContent = ''
                time.textContent = ''
                share.disabled = true
                encodedMsg = ''
                document.body.style.background = weatherBackgrounds.Default
                myInput.focus()
            } else {
                weatherCard.classList.add('hidden')
                myInput.value = myInput.value.charAt(0).toUpperCase() + myInput.value.slice(1)
                errorMessage.textContent = 'Loading ...'
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${myInput.value}&appid=${apiKey}&units=metric`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.cod === 200) {
                        if (weatherCard.classList.contains("hidden")) {
                            weatherCard.classList.remove("hidden")
                        } 
                       
                        share.disabled = false

                           // get the country time 
                           const timestamp = data.dt * 1000; 
                           const timezoneOffset = data.timezone * 1000; 
                           const localDate = new Date(timestamp + timezoneOffset);
                           time.textContent = `Local Time: ${localDate.toLocaleTimeString('en-US', {
                               hour: 'numeric',
                               minute: 'numeric',
                               second: 'numeric', 
                               hour12: true
                           })}`;
                    
                        errorMessage.textContent = ''
                        weatherImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                        cityName.textContent = `${data.name}`
                        temperature.textContent = `${data.main.temp.toFixed(1)} °C`
                        description.textContent = `${data.weather[0].description}`
                        humidity.textContent = `${data.main.humidity} %`

                            // handle what's app msg for sharebtn function

                    let msg = `🌍 Country name : ${data.name}, \n🌡️ Temperature : ${data.main.temp.toFixed(1)} °C,\n🌤️ Description : ${data.weather[0].description}, \n💧 Humidity : ${data.main.humidity}`;
                        encodedMsg = encodeURIComponent(msg);


               


                        // Set dynamic background based on weather
                        const weatherType = data.weather[0].main;
                        document.body.style.background = weatherBackgrounds[weatherType] || weatherBackgrounds.Default;
                        myInput.value = ''
                     
                        
                    } else {
                        errorMessage.textContent = 'City is not found !'
                        weatherCard.classList.add('hidden')
                        time.textContent = ''
                        share.disabled = true
                        encodedMsg = ''
            }
            
        }).catch(() => {
                errorMessage.textContent = 'Network error, try again!'
                time.textContent = ''
                share.disabled = true
                encodedMsg = ''
                
            })
          }
        }
        

        // Handle share btn 
        function shareBtn (msg) {
            window.open(`https://api.whatsapp.com/send?text=${msg}`)
        }

       
       
        // Handle the events
        mainBtn.addEventListener('click',  fetchData)
        myInput.addEventListener('keypress', function (e) {
            e.key === 'Enter' ? fetchData() : false
        })
         // handle the event on share btn
         share.addEventListener('click', () => shareBtn(encodedMsg))
        


})()





