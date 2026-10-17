/**/
import { Text, View, Button} from "react-native";
import {useState} from 'react';


export const Tarea = ({nombre,carrera,materia,cuatri}) => {
  
  const [mostrar, setMostrar] = useState(false);

  return (
    <View>
      <Text>{nombre}</Text>


      {mostrar && 
      <>  
      <Text>{carrera}</Text>
      <Text>{materia}</Text>
      <Text>{cuatri}</Text>
      </>
      }
      <Button title="ver perfil" onPress={() => setMostrar(!mostrar)}/>
    </View>
  );
};