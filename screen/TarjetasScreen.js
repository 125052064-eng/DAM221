import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Perfil } from '../components/Perfil';

export default function TarjetasScreen() {
  return (
    <View style={styles.container}>

      <Perfil style={styles.tarjeta1}  nombre="Oscar" carrera="ITIID" materia="APLICACIONES MOVILES" cuatri="4to"/>
      <Perfil style={styles.tarjeta2} nombre ="Danilo" carrera="ITIID" materia="APLICACIONES MOVILES" cuatri="4to" />
      <Perfil style={styles.tarjeta3} nombre = "Ale" carrera="ITIID" materia="APLICACIONES MOVILES" cuatri="4to" />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarjeta1: {backgroundColor: 'pink'},
  tarjeta2: {backgroundColor: 'lightblue'},
  tarjeta3: {backgroundColor: 'lightgreen'},
});