import { Alert } from "react-native";
import { insertData } from "../utils/firestoreBroker";
import RentTransactionForm from "../components/RentTransactionForm";

const collection = 'RentTransaction';

const CreateRentTransactionScreen = ({navigation, route}) => {
    const { id:rentId, fixedDue } = route.params.rent;
    const addItem = (date, due) => {
        if(!due){
          Alert.alert('Error', 'Please provide a valid due amount.');
          return;
        }
        insertData(collection, {
            time: date,
            rentId: rentId,
            due
          }, () =>  Alert.alert('Success', 'Rent due paid', [
            {
              text: 'View',
              onPress: () => {
                navigation.navigate('ListRentTransaction', route.params);
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            }
          ]));
      }

    return (
        <RentTransactionForm
        action={addItem}
        actionLabel='Pay Rent Due'
        pDate={new Date().getTime()}
        pDue={fixedDue}
        />
    );
}

export default CreateRentTransactionScreen;