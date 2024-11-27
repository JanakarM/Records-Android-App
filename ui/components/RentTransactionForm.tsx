import { useState } from "react";
import { Alert, TextInput, TouchableHighlight } from "react-native";
import { Text } from "react-native-elements"
import { SafeAreaView } from "react-native-safe-area-context";
import { insertData } from "../utils/firestoreBroker";
import StyleSheet from "../StyleSheet";
import DatePicker from './DatePicker';

const collection = 'Rent';

const RentForm = ({action, actionLabel, pDate, pDue}) => {
    const [date, setDate] = useState(pDate)
    const [due, setDue] = useState(pDue)

    return (
        <SafeAreaView style={StyleSheet.manageCanContainer}>
            <DatePicker date={date} updateSelectedDate={(dt) => setDate(dt.$d.getTime())}></DatePicker>
            <Text style={StyleSheet.listHeading}>Rent Due</Text>
            <TextInput
            value={due}
            onChangeText={c=>setDue(c)}
            style={StyleSheet.numberOfCansInput}
            placeholder='Enter the rent due amount.'
            keyboardType='number-pad'
            />
            <TouchableHighlight
            style={StyleSheet.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={() => action(date, due)}>
                <Text style={StyleSheet.addCanButtonText}>{actionLabel}</Text>
            </TouchableHighlight>
        </SafeAreaView>
    );
}

export default RentForm;