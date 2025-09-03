import { ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fond = require('../../assets/images/fond.jpg')

export default function HomeScreen() {
  return (
    <ImageBackground source={fond} style={styles.img_background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.meteo_basic}></View>
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
  },
  searchbar: {
    flex: 2,
  },
  meteo_advanced: {
    flex: 1,
  },
});