import { Alert } from "react-native";
import { insertData, updateData } from "../utils/firestoreBroker";
import RentTransactionForm from "../components/RentTransactionForm";
import { SafeAreaView } from "react-native-safe-area-context";
import StyleSheet from "../StyleSheet";
import { addReminder, cancelNotification, NOTIFICATION_TYPE_RENT } from "../utils/notificationUtil";
import { getNextMonthDate, MONTHS } from "../utils/dateUtil";

const collection = 'RentTransaction';

const EditRentTransactionScreen = ({route, navigation}) => {
    const {id, time, due, rent} = route.params.rentTransaction;

    const editItem = (time, due) => {
        if(!due){
          Alert.alert('Error', 'Please provide a valid amount to update due.');
          return;
        }
        
        // Cancel existing notification before updating
        // Use the rent ID for cancellation with the rent notification type
        cancelNotification(rent.id, NOTIFICATION_TYPE_RENT);
        
        updateData(collection, id, {
            time: time,
            due
          }, () => {
            // Schedule a new notification based on the updated rent date
            // Create a Date object from the updated time
            const updatedDate = new Date(time);
            // Calculate the next reminder date based on the updated rent date
            let scheduleDate = getNextMonthDate(updatedDate, updatedDate.getDate());
            
            // Include rent name in notification message for better context
            addReminder('Rent Due', `Its time to pay the rent for ${rent.name || 'your property'} - ${MONTHS[scheduleDate.getMonth()]}`, rent.id, scheduleDate, NOTIFICATION_TYPE_RENT);
            
            Alert.alert('Success', `Rent due updated for ${rent.name || 'your property'}. You will be reminded to pay next due on ${scheduleDate.toDateString()}`, [
              {text: 'View', onPress: () => navigation.navigate('ListRentTransaction', {rent})}
            ]);
          });
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
