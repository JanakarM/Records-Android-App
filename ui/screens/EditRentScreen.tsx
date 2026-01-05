import { Alert } from "react-native";
import { updateData } from "../data/DataBrokerProvider";
import RentForm from "../components/RentForm";

const collection = 'Rent';

const EditRentScreen = ({route, navigation}) => {
    const {id, time, name, amount, fixedDue, remindOnDay} = route.params.rent;

    const editItem = (time, name, advance, fixedDue, remindOnDay) => {
        if(!name || !advance || !fixedDue){
          Alert.alert('Missing Information', 'Please fill in all required fields (name, advance, and fixed due).');
          return;
        }
        updateData(collection, id, {
            amount: advance,
            time: time,
            name: name,
            fixedDue,
            remindOnDay
          }, 
          () => {
            // Rent record updated successfully - no need to schedule reminder here
            // Reminders will be created when rent transactions are created
            Alert.alert('Rent Updated', 'Your changes have been saved.', [{text: 'View', onPress: () => navigation.navigate('ListRent')}]);
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