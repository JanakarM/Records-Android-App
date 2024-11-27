import { Alert } from "react-native";
import { insertData } from "../utils/firestoreBroker";
import RentForm from "../components/RentForm";

const collection = 'Rent';

const CreateRentScreen = ({navigation}) => {
    const addItem = (date, name, advance, fixedDue) => {
      if(!name || !advance || !fixedDue){
          Alert.alert('Error', 'Please provide a valid name and advance to create entry.');
          return;
        }
        insertData(collection, {
            time: date,
            amount: advance,
            name,
            fixedDue
          }, () =>  Alert.alert('Success', 'Rent Created', [
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
          ]));
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