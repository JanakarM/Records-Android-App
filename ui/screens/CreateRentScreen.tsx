import { Alert } from "react-native";
import { insertData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";
import { addNotification, addReminder } from "../utils/notificationUtil";
import { getCurrentMonth, getNextMonthDate } from "../utils/dateUtil";

const collection = 'Rent';

const CreateRentScreen = ({navigation}) => {
    const addItem = (date, name, advance, fixedDue, remindOnDay) => {
      if(!name || !advance || !fixedDue){
          Alert.alert('Error', 'Please provide a valid name and advance to create entry.');
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
        insertData(collection, {
            time: date,
            amount: advance,
            name,
            fixedDue,
            remindOnDay
          }, (doc) =>  {
            addReminder('Rent Due', `Its time to pay the rent for ${scheduleDate.getMonth()}`, doc.id);
            Alert.alert('Success', 'Rent Created', [
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