/*1. Zona Importaciones*/
import { StyleSheet, Text, View } from 'react-native';

/*2. Zona Render o main*/
export default function ActivityIndicatorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ActivityIndicator & KeyboardAvoidingView</Text>
      <Text style={styles.equipo}>Alexa</Text>
    </View>
  );
}

/*3. Zona estilos y posicionamiento*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  equipo: {
    fontSize: 14,
    textAlign: 'center',
  },
});