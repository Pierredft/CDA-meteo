import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fond = require('../../assets/images/fond.jpg')

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<any>(null);
  // const [location, setLocation] = useState<Location.LocationObject | null>(null); // Supprimé car inutilisé

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
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission de géolocalisation refusée');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});

      // Appel de l'API météo avec les coordonnées
      getWeatherData(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Erreur lors de la récupération de la géolocalisation:', error);
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
              <Text style={styles.city}>Météo actuelle</Text>
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
              <Text style={styles.loadingText}>Récupération météo...</Text>
            </View>
          )}
        </View>
        <View style={styles.searchbar}></View>
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
  searchbar: {
    flex: 2,
  },
  meteo_advanced: {
    flex: 1,
  },
  city: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontWeight: '500',
  },
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
});
