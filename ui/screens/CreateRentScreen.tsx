import { useState } from "react";
import { Alert, TextInput, TouchableHighlight } from "react-native";
import { Text } from "react-native-elements"
import { SafeAreaView } from "react-native-safe-area-context";
import { insertData } from "../utils/firestoreBroker";
import StyleSheet from "../StyleSheet";
import DatePicker from '../components/DatePicker';

const collection = 'Rent';

const CreateRentScreen = () => {
    const [date, setDate] = useState(new Date().getTime())
    const [name, setName] = useState()
    const [advance, setAdvance] = useState()
    const addItem = () => {
        if(name == '' || advance == ''){
          Alert.alert('Error', 'Please provide a valid name and advance to create entry.');
          return;
        }
        insertData(collection, {
            time: date,
            amount: advance,
            name: name
          }, () => Alert.alert('Success', 'Rent created.'));
      }

    return (
        <SafeAreaView style={StyleSheet.manageCanContainer}>
            <DatePicker date={date} updateSelectedDate={(dt) => setDate(dt.$d.getTime())}></DatePicker>
            <Text style={StyleSheet.listHeading}>Name</Text>
            <TextInput 
            value={name}
            onChangeText={c=>setName(c)}
            style={StyleSheet.numberOfCansInput}
            placeholder='Enter the name.'
            />
            <Text style={StyleSheet.listHeading}>Advance</Text>
            <TextInput
            value={advance}
            onChangeText={c=>setAdvance(c)}
            style={StyleSheet.numberOfCansInput}
            placeholder='Enter the advance amount.'
            keyboardType='number-pad'
            />
            <TouchableHighlight
            style={StyleSheet.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={addItem}>
                <Text style={StyleSheet.addCanButtonText}>Create Rent</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
}

export default CreateRentScreen;