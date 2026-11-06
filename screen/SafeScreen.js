/*1. Zona Importaciones*/
import { StyleSheet, View, Text, ScrollView, SafeAreaView} from 'react-native';

/*2. Zona Render o main*/
export default function SafeScreen() {
  const canciones = ['1', '2', '4', '5', '6', '7'];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}> MUSICA </Text>
      
      <View style={styles.reproductor}>
        <Text style={styles.texto}> Lista de musica </Text>
        <Text> La musica mas escuchada </Text>
      </View>

      <Text style={styles.subtitulo}> Canciones disponibles </Text>

      <ScrollView 
        style={styles.lista}
        contentContainerStyle={styles.contenidoLista}
        showsVerticalScrollIndicator={true}
      >
        {canciones.map((item, index) => (
          <View key={index} style={styles.tarjetas}>
            <Text style={styles.textoLista}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/*3. Zona estilos y posicionamiento*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c6a298',
    padding: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  reproductor: {
    backgroundColor: 'lightpink',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  texto: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  lista: {
    flex: 1,
  },
  tarjetas: {
    backgroundColor: 'lightyellow',
    padding: 20,
    marginBottom: 10,
    borderRadius: 15,
  },
  textoLista: {
    fontSize: 18,
    textAlign: 'center',
  }
});