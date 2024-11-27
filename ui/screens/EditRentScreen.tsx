import { Alert } from "react-native";
import { insertData, updateData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";

const collection = 'Rent';

const EditRentScreen = ({route, navigation}) => {
    const {id, time, name, amount, fixedDue} = route.params.rent;

    const editItem = (time, name, advance, fixedDue) => {
        if(!name || !advance || !fixedDue){
          Alert.alert('Error', 'Please provide a valid name and advance to update entry.');
          return;
        }
        updateData(collection, id, {
            time: time,
            amount: advance,
            name: name
          }, () => Alert.alert('Success', 'Rent updated.', [{text: 'View', onPress: () => navigation.navigate('ListRent')}]));
      }

    return (
        <RentForm
        action={editItem}
        actionLabel='Edit Rent'
        pDate={time}
        pName={name}
        pAdvance={amount}
        pFixedRentAmount={fixedDue}
        />
    );
}

export default EditRentScreen;