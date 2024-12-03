import { Alert } from "react-native";
import { insertData } from "../utils/firestoreBroker";
import RentTransactionForm from "../components/RentTransactionForm";
import { getNextMonthDate, MONTHS } from "../utils/dateUtil";
import { addReminder } from "../utils/notificationUtil";

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
          }, 
          () => {
            let scheduleDate = getNextMonthDate();
            addReminder('Rent Due', `Its time to pay the rent for ${MONTHS[scheduleDate.getMonth()]}`, route.params.rent, scheduleDate);
            Alert.alert('Success', `Rent due paid. You will be reminded to pay next due on ${scheduleDate.toDateString()}`, [
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
            ])
          }
        );
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