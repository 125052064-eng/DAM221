/*1. Zona Importaciones*/
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import {Saludo} from './components/Saludo'
import {Saludo2} from './components/Saludo2'
import {Tarea} from './components/Tarea'

/*2. Zona Render o main*/
export default function App() {
  return (
    <View style={styles.container}>

        <Tarea nombre="Oscar" carrera="TIID" materia="movil" cuatri= "4"/>

        <Tarea nombre="Danilo" carrera="TIID" materia="Movil" cuatri="4"/>
   
        <Tarea nombre="Alexa" carrera="TIID" materia="Movil" cuatri="4"/>
    {/*   <Text>Hola Mundo React Native</Text>
      <Image source={require('./assets/manita.jpg')}></Image>

        <Text> _________________________ </Text>
        <Saludo></Saludo>
        <Saludo/>

        <Text> _________________________ </Text>
        <Saludo2></Saludo2>
        <Saludo2/> */}
       
      <StatusBar style="auto" />
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
  },
});
