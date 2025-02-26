import { LightningElement, track } from 'lwc';
import getWeather from '@salesforce/apex/FiveDaysWeatherController.getWeather';
import getForecast from '@salesforce/apex/FiveDaysWeatherController.getForecast';

export default class WeatherApp extends LightningElement {
    @track cityName = '';
    @track weatherData;
    @track forecastData = [];
    @track error;
    @track isLoading = false;
    weatherIcon;

    handleInputChange(event) {
        this.cityName = event.target.value;
    }

    fetchWeather() {
        if (this.cityName) {
            this.isLoading = true;
            getWeather({ cityName: this.cityName })
                .then((result) => {
                    if (result) {
                        this.weatherData = result;
                        this.weatherIcon = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
                        this.error = null;
                        this.fetchForecast();
                    } else {
                        this.weatherData = null;
                        this.error = 'Weather data not found';
                    }
                })
                .catch((error) => {
                    this.weatherData = null;
                    this.error = 'Error fetching weather data';
                    console.error(error);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        } else {
            this.error = 'Please enter a city name';
        }
    }

    fetchForecast() {
        getForecast({ cityName: this.cityName })
            .then((result) => {
                if (result && result.list) {
                    const dailyData = [];
                    for (let i = 0; i < result.list.length; i += 8) {
                        dailyData.push({
                            date: new Date(result.list[i].dt_txt).toLocaleDateString(),
                            temp: result.list[i].main.temp,
                            description: result.list[i].weather[0].description,
                            icon: `http://openweathermap.org/img/wn/${result.list[i].weather[0].icon}@2x.png`
                        });
                    }
                    this.forecastData = dailyData;
                }
            })
            .catch((error) => {
                this.forecastData = [];
                console.error(error);
            });
    }
}