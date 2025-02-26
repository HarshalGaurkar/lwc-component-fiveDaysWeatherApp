public with sharing class FiveDaysWeatherController {
    private static final String API_KEY = '9b3b0b0293663de269f8b62268db1cc5'; //Replace with your OpenWeatherMap API key
    
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getWeather(String cityName) {
        String url = 'https://api.openweathermap.org/data/2.5/weather?q=' + EncodingUtil.urlEncode(cityName, 'UTF-8') + '&appid=' + API_KEY + '&units=metric';
        return fetchWeatherData(url);
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getForecast(String cityName) {
        String url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + EncodingUtil.urlEncode(cityName, 'UTF-8') + '&appid=' + API_KEY + '&units=metric';
        return fetchWeatherData(url);
    }

    private static Map<String, Object> fetchWeatherData(String url) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            return (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
        }
        return null;
    }
}