import { Alert } from "react-native";
import { insertData } from "../data/DataBrokerProvider";
import RentForm from "../components/RentForm";

const collection = 'Rent';

const CreateRentScreen = ({navigation}) => {
    const addItem = (date, name, advance, fixedDue, remindOnDay) => {
      if(!name || !advance || !fixedDue){
          Alert.alert('Missing Information', 'Please fill in all required fields (name, advance, and fixed due).');
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
            Alert.alert('Rent Created', 'Your rent record has been saved successfully.', [
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