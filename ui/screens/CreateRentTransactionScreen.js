import { Alert } from "react-native";
import { insertData } from '../data/DataBrokerProvider';
import RentTransactionForm from "../components/RentTransactionForm";
import { getNextMonthDate, MONTHS } from "../utils/dateUtil";
import { addReminder, NOTIFICATION_TYPE_RENT } from "../utils/notificationUtil";

const collection = 'RentTransaction';

const CreateRentTransactionScreen = ({route, navigation}) => {
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
            // Get the rent details including the remindOnDay
            const { remindOnDay } = route.params.rent;
            
            // Create a Date object from the transaction date
            const transactionDate = new Date(date);
            
            // Calculate the next reminder date based on the remindOnDay setting
            // This ensures the notification is scheduled for the next month on the reminder day
            let scheduleDate = getNextMonthDate(transactionDate, remindOnDay || transactionDate.getDate());
            
            // Include rent name in notification message for better context
            addReminder('Rent Due', `Its time to pay the rent for ${route.params.rent.name || 'your property'} - ${MONTHS[scheduleDate.getMonth()]}`, rentId, scheduleDate, NOTIFICATION_TYPE_RENT);
            Alert.alert('Success', `Rent due paid for ${route.params.rent.name || 'your property'}. You will be reminded to pay next due on ${scheduleDate.toDateString()}`, [
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
