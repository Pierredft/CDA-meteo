import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useEffect, useState, useCallback } from 'react';

const fond = require('../../assets/images/fond.jpg')

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Fonction pour récupérer la météo
  const getWeatherData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
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
      setLocation(location);

      // Appel de l'API météo avec les coordonnées
      getWeatherData(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Erreur lors de la récupération de la géolocalisation:', error);
    }
  }, []);

  // Récupération automatique au démarrage
  useEffect(() => {
    getLocation();
  }, [getLocation]);
  return (
    <ImageBackground source={fond} style={styles.img_background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.meteo_basic}>
          {weatherData && (
            <>
              <Text style={styles.temperature}>
                {Math.round(weatherData.current_weather.temperature)}°C
              </Text>
              <Text style={styles.location}>
                Lat: {location?.coords.latitude?.toFixed(2)},
                Lon: {location?.coords.longitude?.toFixed(2)}
              </Text>
            </>
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
  },
  searchbar: {
    flex: 2,
  },
  meteo_advanced: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
});
