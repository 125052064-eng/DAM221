/*1. Zona Importaciones*/
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, SectionList, TouchableOpacity, SafeAreaView } from 'react-native';

/*2. Zona Render o main*/
export default function App() {
  const [vistaActual, setVistaActual] = useState('flat');

  // Estado para FlatList
  const [serviciosFlat] = useState([
    { id: '1', titulo: 'Clases de Inglés', categoria: 'Educación' },
    { id: '2', titulo: 'Reparación de PC', categoria: 'Tecnología' },
  ]);

  // Estado para SectionList
  const [secciones] = useState([
    { title: 'Educación', data: ['Clases de Inglés', 'Asesoría de Matemáticas'] },
    { title: 'Tecnología', data: ['Reparación de PC', 'Redes'] },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Navegación entre vistas */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.btn} onPress={() => setVistaActual('flat')}>
          <Text style={styles.txt}>FlatList</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setVistaActual('section')}>
          <Text style={styles.txt}>SectionList</Text>
        </TouchableOpacity>
      </View>

      {/* Renderizado condicional */}
      {vistaActual === 'flat' ? (
        <View style={styles.content}>
          <Text style={styles.sub}>FlatList</Text>
          <FlatList
            data={serviciosFlat}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text>{item.titulo} ({item.categoria})</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sub}>SectionList (Categorizada)</Text>
          <SectionList
            sections={secciones}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text>{item}</Text>
              </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  nav: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  btn: { backgroundColor: '#2563eb', padding: 8, marginHorizontal: 5, borderRadius: 4 },
  content: { flex: 1 },
  sub: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  card: { backgroundColor: '#f8fafc', padding: 10, marginVertical: 3, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 4 },
  header: { fontSize: 15, fontWeight: 'bold', backgroundColor: '#e2e8f0', padding: 6, marginTop: 8 },
  txt: { color: '#fff', fontWeight: 'bold' }
});









