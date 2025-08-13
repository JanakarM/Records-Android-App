import { Alert } from "react-native";
import { updateData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";

const collection = 'Rent';

const EditRentScreen = ({route, navigation}) => {
    const {id, time, name, amount, fixedDue, remindOnDay} = route.params.rent;

    const editItem = (time, name, advance, fixedDue, remindOnDay) => {
        if(!name || !advance || !fixedDue){
          Alert.alert('Error', 'Please provide a valid name and advance to update entry.');
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
            Alert.alert('Success', 'Rent record updated successfully', [{text: 'View', onPress: () => navigation.navigate('ListRent')}]);
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