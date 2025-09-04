import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, ImageBackground, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const fond = require('../../assets/images/fond.jpg')
export default function HomeScreen() {
const [weatherData, setWeatherData] = useState<any>(null);
const [searchCity, setSearchCity] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [cityName, setCityName] = useState('Ma position');
// Fonction pour récupérer la météo
const getWeatherData = async (latitude: number, longitude: number) => {
try {
const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation&timezone=auto`);
const data = await response.json();
setWeatherData(data);
} catch (error) {
console.error('Erreur lors de la récupération météo:', error);
}
};
// Fonction pour récupérer la géolocalisation
const getLocation = useCallback(async () => {
setIsLoading(true);
try {
let { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
console.log('Permission de géolocalisation refusée');
setIsLoading(false);
return;
}
let location = await Location.getCurrentPositionAsync({});
setCityName('Ma position');
await getWeatherData(location.coords.latitude, location.coords.longitude);
} catch (error) {
console.error('Erreur géolocalisation:', error);
alert('Erreur de géolocalisation');
} finally {
setIsLoading(false);
}
}, []);
// Fonction pour convertir le code météo en description
const getWeatherDescription = (code: number) => {
const weatherCodes = {
0: "Ciel dégagé",
1: "Principalement dégagé",
2: "Partiellement nuageux",
3: "Couvert",
45: "Brouillard",
48: "Brouillard givrant",
51: "Bruine légère",
53: "Bruine modérée",
55: "Bruine dense",
61: "Pluie légère",
63: "Pluie modérée",
65: "Pluie forte",
71: "Neige légère",
73: "Neige modérée",
75: "Neige forte",
95: "Orage"
};
return (weatherCodes as Record<number, string>)[code] || "Météo inconnu";
};
// Fonction pour convertir les degrés en direction du vent
const getWindDirection = (degrees: number) => {
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const index = Math.round(degrees / 45) % 8;
return directions[index];
};
// Fonction pour rechercher une ville
const handleCitySearch = async () => {
if(!searchCity.trim()) return;

setIsLoading(true);
try {
// Utilisation de l'API Geocoding d'Open-Meteo pour convertir une ville en coordonnées
const geocodingResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=fr&format=json`);
const geocodingData = await geocodingResponse.json();
if (geocodingData.results && Array.isArray(geocodingData.results) &&
geocodingData.results.length > 0) {
const city = geocodingData.results[0];
await getWeatherData(city.latitude, city.longitude);
setCityName(`${city.name}, ${city.country}`);
} else {
alert('Ville non trouvée. Vérifiez l\'orthographe ou essayez une autre ville.');
}
} catch (error) {
console.error('Erreur lors de la recherche de la ville:', error);
alert('Erreur lors de la recherche de la ville. Veuillez réessayer plus tard.');
} finally {
setIsLoading(false);
}
};
// Récupération automatique au démarrage
useEffect(() => {
getLocation();
}, [getLocation]);
return (
<ImageBackground source={fond} style={styles.img_background}>
<SafeAreaView style={styles.container}>
<View style={styles.meteo_basic}>
{weatherData ? (
<>
<Text style={styles.city}>{cityName}</Text>
<Text style={styles.temperature}>
{Math.round(weatherData.current_weather.temperature)}°C
</Text>
<Text style={styles.weatherDescription}>
{getWeatherDescription(weatherData.current_weather.weathercode)}
</Text>
<View style={styles.weatherDetails}>
<Text style={styles.detailText}>
💨 {weatherData.current_weather.windspeed} km/h
</Text>
<Text style={styles.detailText}>
🧭 {getWindDirection(weatherData.current_weather.winddirection)}
</Text>
</View>
</>
) : (
<View style={styles.loadingContainer}>
<ActivityIndicator size="large" color="white" />
<Text style={styles.loadingText}>
{isLoading ? 'Recherche en cours...' : 'Récupération météo...'}
</Text>
</View>
)}
</View>
<View style={styles.searchbar}>
<View style={styles.searchContainer}>
<TextInput style={styles.searchInput} placeholder="Rechercher une ville..."
placeholderTextColor="rgba(255,255,255,0.6)" value={searchCity}
onChangeText={setSearchCity} onSubmitEditing={handleCitySearch} />
<TouchableOpacity style={styles.searchButton} onPress={handleCitySearch}
disabled={isLoading}>
<Text style={styles.searchButtonText}>🔎</Text>
</TouchableOpacity>
</View>
<TouchableOpacity style={styles.locationButton} onPress={getLocation}
disabled={isLoading}>
<Text style={styles.locationButtonText}>📍 Utiliser ma position</Text>
</TouchableOpacity>
</View>
<View style={styles.meteo_advanced}></View>
</SafeAreaView>
</ImageBackground>
);
}
const styles = StyleSheet.create({
container: {
flex: 1,
},
img_background: {
flex: 1
},
meteo_basic: {
flex: 2,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
},
// searchbar: doublon supprimé
meteo_advanced: {
flex: 1,
},
// city: doublon supprimé
temperature: {
fontSize: 64,
fontWeight: 'bold',
color: 'white',
textAlign: 'center',
marginBottom: 8,
},
weatherDescription: {
fontSize: 20,
color: 'rgba(255,255,255,0.9)',
textAlign: 'center',
marginBottom: 16,
fontStyle: 'italic',
},
weatherDetails: {
flexDirection: 'row',
justifyContent: 'space-around',
width: '100%',
marginTop: 16,
},
detailText: {
fontSize: 16,
color: 'rgba(255,255,255,0.8)',
textAlign: 'center',
},
loading: {
fontSize: 18,
color: 'rgba(255,255,255,0.7)',
textAlign: 'center',
},
loadingText: {
fontSize: 18,
color: 'rgba(255,255,255,0.7)',
textAlign: 'center',
},
loadingContainer: {
justifyContent: 'center',
alignItems: 'center',
},
searchbar: {
flex: 2,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
},
searchContainer: {
flexDirection: 'row',
width: '100%',
marginBottom: 16,
},
searchInput: {
flex: 1,
backgroundColor: 'rgba(255,255,255,0.2)',
borderRadius: 25,
paddingHorizontal: 20,
paddingVertical: 12,
fontSize: 16,
color: 'white',
marginRight: 8,
},
searchButton: {
backgroundColor: 'rgba(255,255,255,0.3)',
borderRadius: 25,
width: 50,
height: 50,
justifyContent: 'center',
alignItems: 'center',
},
searchButtonText: {
fontSize: 20,
},
locationButton: {
backgroundColor: 'rgba(255,255,255,0.2)',
borderRadius: 20,
paddingHorizontal: 20,
paddingVertical: 10,
},
locationButtonText: {
color: 'white',
fontSize: 16,
fontWeight: '500',
},
// Modification du style city existant
city: {
fontSize: 18,
color: 'rgba(255,255,255,0.9)',
marginBottom: 8,
fontWeight: '500',
textAlign: 'center',
},
});