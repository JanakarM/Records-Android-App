import { Alert } from "react-native";
import { insertData, updateData } from "../utils/firestoreBroker";
import RentTransactionForm from "../components/RentTransactionForm";

const collection = 'RentTransaction';

const EditRentTransactionScreen = ({route, navigation}) => {
    const {id, time, due, rentId} = route.params.rentTransaction;

    const editItem = (time, due) => {
        if(!due){
          Alert.alert('Error', 'Please provide a valid amount to update due.');
          return;
        }
        updateData(collection, id, {
            time: time,
            due
          }, () => Alert.alert('Success', 'Rent due updated.', [{text: 'View', onPress: () => navigation.navigate('ListRentTransaction', {rent: {id: rentId}})}]));
      }

    return (
        <RentTransactionForm
        action={editItem}
        actionLabel='Edit Rent Due'
        pDate={time}
        pDue={due}
        />
    );
}

export default EditRentTransactionScreen;