import { Alert } from "react-native";
import { insertData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";

const collection = 'Rent';

const EditRentScreen = ({route}) => {
    const [date, name, advance] = route.params.rent;

    const editItem = (date, name, advance) => {
        if(!name || !advance){
          Alert.alert('Error', 'Please provide a valid name and advance to update entry.');
          return;
        }
        insertData(collection, {
            time: date,
            amount: advance,
            name: name
          }, () => Alert.alert('Success', 'Rent updated.'));
      }

    return (
        <RentForm
        action={editItem}
        actionLabel='Edit Rent'
        pDate={date}
        pName={name}
        pAdvance={advance}
        />
    );
}

export default EditRentScreen;