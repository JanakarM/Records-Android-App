import { Alert } from "react-native";
import { insertData } from "../data/DataBrokerProvider";
import RentForm from "../components/RentForm";

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
            // Rent record created successfully - no need to schedule reminder here
            // Reminders will be created when rent transactions are created
            Alert.alert('Success', 'Rent record created successfully', [
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