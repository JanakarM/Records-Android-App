import { Alert } from "react-native";
import { insertData, updateData } from "../utils/firestoreBroker";
import RentTransactionForm from "../components/RentTransactionForm";
import { SafeAreaView } from "react-native-safe-area-context";
import StyleSheet from "../StyleSheet";

const collection = 'RentTransaction';

const EditRentTransactionScreen = ({route, navigation}) => {
    const {id, time, due, rent} = route.params.rentTransaction;

    const editItem = (time, due) => {
        if(!due){
          Alert.alert('Error', 'Please provide a valid amount to update due.');
          return;
        }
        updateData(collection, id, {
            time: time,
            due
          }, () => Alert.alert('Success', 'Rent due updated.', [{text: 'View', onPress: () => navigation.navigate('ListRentTransaction', {rent})}]));
      }

    return (
      <SafeAreaView style={StyleSheet.manageCanContainer}>
        <RentTransactionForm
        action={editItem}
        actionLabel='Edit Rent Due'
        pDate={time}
        pDue={due}
        />
      </SafeAreaView>
    );
}

export default EditRentTransactionScreen;