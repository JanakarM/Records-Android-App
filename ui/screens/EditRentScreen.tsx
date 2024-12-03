import { Alert } from "react-native";
import { insertData, updateData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";
import { addReminder } from "../utils/notificationUtil";
import { getNextMonthDate, MONTHS } from "../utils/dateUtil";

const collection = 'Rent';

const EditRentScreen = ({route, navigation}) => {
    const {id, time, name, amount, fixedDue, remindOnDay} = route.params.rent;

    const editItem = (time, name, advance, fixedDue, remindOnDay) => {
        if(!name || !advance || !fixedDue){
          Alert.alert('Error', 'Please provide a valid name and advance to update entry.');
          return;
        }
        updateData(collection, id, {
            time: time,
            amount: advance,
            name: name,
            fixedDue,
            remindOnDay
          }, 
          () => {
            let today = new Date();
            let day = today.getDay();
            let scheduleDate = new Date();
            if(day > remindOnDay) {
              getNextMonthDate(scheduleDate, remindOnDay);
            } else {
              scheduleDate.setDate(remindOnDay);
            }
            addReminder('Rent Due', `Its time to pay the rent for ${MONTHS[scheduleDate.getMonth()]}`, route.params.rent, scheduleDate);
            Alert.alert('Success', `Rent updated. You will be reminded to pay rent due on ${scheduleDate.toDateString()}`, [{text: 'View', onPress: () => navigation.navigate('ListRent')}]);
          }
        );
      }

    return (
        <RentForm
        action={editItem}
        actionLabel='Update Rent'
        pDate={time}
        pName={name}
        pAdvance={amount}
        pFixedRentAmount={fixedDue}
        pRemindOnDay={remindOnDay}
        />
    );
}

export default EditRentScreen;