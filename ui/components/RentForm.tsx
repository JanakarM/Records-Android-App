import { useState } from "react";
import { Alert, TextInput, TouchableHighlight } from "react-native";
import { Text } from "react-native-elements"
import { SafeAreaView } from "react-native-safe-area-context";
import { insertData } from "../utils/firestoreBroker";
import StyleSheet from "../StyleSheet";
import DatePicker from '../components/DatePicker';

const collection = 'Rent';

const RentForm = ({action, actionLabel, pDate, pName, pAdvance, pFixedRentAmount}) => {
    const [date, setDate] = useState(pDate)
    const [name, setName] = useState(pName)
    const [advance, setAdvance] = useState(pAdvance)
    const [fixedDue, setFixedDue] = useState(pFixedRentAmount)

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
            <Text style={StyleSheet.listHeading}>Fixed Due</Text>
            <TextInput
            value={fixedDue}
            onChangeText={c=>setFixedDue(c)}
            style={StyleSheet.numberOfCansInput}
            placeholder='Enter the fixed rent amount.'
            keyboardType='number-pad'
            />
            <TouchableHighlight
            style={StyleSheet.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={() => action(date, name, advance, fixedDue)}>
                <Text style={StyleSheet.addCanButtonText}>{actionLabel}</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
}

export default RentForm;