import { StyleSheet, View, Text, Button } from 'react-native';
import { useState } from 'react';
import TarjetasScreen from './TarjetasScreen';
import SafeScreen from './SafeScreen';
import PressableScreen from './PressableScreen';
import TextInputScreen from './TextInputScreen';
import FlatListScreen from './FlatListScreen';
import ImageBackgroundScreen from './ImageBackgroungScreen';
import ModalScreen from './ModalScreen';
import ActivityIndicatorScreen from './ActivityIndicatorScreen';

/* 2.- Zona render o Main*/
export default function MenuScreen() {
    const [screen,setScreen] = useState('Menu');

    switch (screen) {
    case 'tarjetas':
      return <TarjetasScreen/>;

    case 'safe':
      return <SafeScreen/>;

    case 'pressable':
      return <PressableScreen/>;

    case 'textinput':
      return <TextInputScreen/>;

    case 'flatlist':
      return <FlatListScreen/>;

    case 'imagebackground':
      return <ImageBackgroundScreen/>;

    case 'modal':
      return <ModalScreen/>;

    case 'activityindicator':
      return <ActivityIndicatorScreen/>;
    
    case 'Menu':
            default:
            return (
    <View style={styles.container}>
        <Text> Menu de Practicas </Text>
        <Button title= "Pract: Tarjetas" onPress={() => setScreen('tarjetas')}/>
        <Button title= "Pract: SafeAreaView" onPress={() => setScreen('safe')}/> 
        <Button title= "Pract: Pressable & switch" onPress={() => setScreen('pressable')}/>
        <Button title= "Pract: TextInput & Alert " onPress={() => setScreen('textinput')}/> 
        <Button title= "Pract: FlatList & SectionList" onPress={() => setScreen('flatlist')}/>
        <Button title= "Pract: ImageBackgroung & SlapshScreen" onPress={() => setScreen('imagebackground')}/> 
        <Button title= "Pract: Modal & Bottom sheet" onPress={() => setScreen('modal')}/>
        <Button title= "Pract: ActivityIndicator, KeyboardAvoidingView" onPress={() => setScreen('activityindicator')}/> 
        <Button title= "Pract: Pressable" onPress={() => setScreen('pressable')} />


    </View>
  );
} //switch
} //funcion 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

});