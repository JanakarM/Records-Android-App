import { Alert } from "react-native";
import { insertData, updateData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";
import { addReminder } from "../utils/notificationUtil";
import { getNextMonthDate } from "../utils/dateUtil";

const collection = 'Rent';

const EditRentScreen = ({route, navigation}) => {
    const {id, time, name, amount, fixedDue, remindOnDay} = route.params.rent;

    const editItem = (time, name, advance, fixedDue, remindOnDay) => {
        if(!name || !advance || !fixedDue){
          Alert.alert('Error', 'Please provide a valid name and advance to update entry.');
          return;
        }
        let today = new Date();
        let day = today.getDay();
        let scheduleDate = new Date();
        if(day > remindOnDay) {
          getNextMonthDate(scheduleDate, remindOnDay);
        } else {
          scheduleDate.setDate(remindOnDay);
        }
        console.log(scheduleDate.toDateString());
        addReminder('Rent Due', `Its time to pay the rent for ${scheduleDate.getMonth()}`);
        updateData(collection, id, {
            time: time,
            amount: advance,
            name: name,
            fixedDue,
            remindOnDay
          }, () => Alert.alert('Success', 'Rent updated.', [{text: 'View', onPress: () => navigation.navigate('ListRent')}]));
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