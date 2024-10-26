import { useState } from "react";
import { ScrollView, Text, TextInput, View , StyleSheet} from "react-native";
import { Colors } from "../../constants/colors";


export default function Placeform(){
    const [enteredTitle, setEnteredTitle] = useState('');

    function changeTitleHandler(enteredTitle){
         setEnteredTitle(enteredTitle);
    }




    return (

        <ScrollView style={styles.form}>
            <View>
                <Text  style={styles.label}>Form</Text>
                <TextInput  style={styles.input} onChangeText={changeTitleHandler} value={enteredTitle} />
            </View>
        </ScrollView>
    );

}


const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 24
    },
    label:{
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.primary500
    },
    input: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        borderBottomColor: Colors.primary700,
        borderBottomWidth: 1,
        backgroundColor: Colors.primary100,
        fontSize: 16
    }

})