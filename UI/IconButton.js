import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';


export default function IconButton ({icon, size, color, onPress}) {

   
      
    return (
        <Pressable style={({pressed})  => [styles.button, pressed && styles.pressed]}>
            <Ionicons name={icon} size={size} color={color} onPress={onPress} />
        </Pressable>
    )


}


const styles = StyleSheet.create({
  button:{
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',

  },
  pressed:{
    opacity: 0.7
  }

});