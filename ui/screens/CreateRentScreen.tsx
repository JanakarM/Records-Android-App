import { Alert } from "react-native";
import { insertData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";
import { addReminder } from "../utils/notificationUtil";
import { getNextMonthDate, MONTHS } from "../utils/dateUtil";

const collection = 'Rent';

const CreateRentScreen = ({navigation}) => {
    const addItem = (date, name, advance, fixedDue, remindOnDay) => {
      if(!name || !advance || !fixedDue){
          Alert.alert('Error', 'Please provide a valid name and advance to create entry.');
          return;
        }
        insertData(collection, {
            time: date,
            amount: advance,
            name,
            fixedDue,
            remindOnDay
          }, (doc) =>  {
            let today = new Date();
            let day = today.getDate();
            let scheduleDate = new Date();
            if(day > remindOnDay) {
              getNextMonthDate(scheduleDate, remindOnDay);
            } else {
              scheduleDate.setDate(remindOnDay);
            }
            addReminder('Rent Due', `Its time to pay the rent for ${MONTHS[scheduleDate.getMonth()]}`, {id: doc.id, name, time: date, amount: advance, fixedDue, remindOnDay}, scheduleDate);
            Alert.alert('Success', `Rent Created. You will be reminded to pay rent due on ${scheduleDate.toDateString()}`, [
              {
                text: 'View',
                onPress: () => {
                  navigation.navigate('ListRent');
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              }
            ])
          });
      }

    return (
        <RentForm
        action={addItem}
        actionLabel='Add Rent'
        pDate={new Date().getTime()}
        />
    );
}

export default CreateRentScreen;