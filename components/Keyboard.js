import { useState } from 'react';
import {ActivityIndicator,Button,Keyboard as Teclado,KeyboardAvoidingView,Text,TextInput,View,} from 'react-native';

export default function Practica() {
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function enviar() {
    Teclado.dismiss();
    setEnviado(false);
    setCargando(true);

    setTimeout(() => {
      setCargando(false);
      setEnviado(true);
    }, 2000);
  }

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={0}
      // Cambia a false para desactivar el ajuste del teclado.
      enabled={true}
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
      }}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <TextInput
        placeholder="Escribe tu mensaje"
        style={{ borderWidth: 1, padding: 10, marginBottom: 16 }}
      />

      <View style={{ marginVertical: 16 }}>
        <Button title="Enviar" onPress={enviar} />
      </View>

      {cargando && (
        <>
          <ActivityIndicator
            animating={cargando}
            color="#1783c6"
            size="large"
            style={{ margin: 16 }}
          />
          <Text style={{ textAlign: 'center' }}>Cargando...</Text>
        </>
      )}

      {enviado && !cargando && (
        <Text style={{ textAlign: 'center' }}>Listo</Text>
      )}
    </KeyboardAvoidingView>
  );
}