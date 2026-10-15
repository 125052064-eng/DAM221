import { Text, Image, Button, View } from "react-native";

export const Saludo2 = () => {
    return(

        <View>
                    <Text> Hola RN: Soy un componente Propio compuesto</Text>
                   <Image source={require('../assets/manita.jpg')}></Image>
                   <Button title="presiona para saludar"/> 
        </View>
    )
}