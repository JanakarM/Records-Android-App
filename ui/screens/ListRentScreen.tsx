import { SafeAreaView } from "react-native-safe-area-context";
import StyleSheet from "../StyleSheet";
import { Alert, FlatList, Pressable, TouchableHighlight, View } from "react-native";
import { Text } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { deleteData, getSnapShot } from "../utils/firestoreBroker";
import EmptyState from '../components/EmptyState';

const collection = 'Rent';

const ListItem = ({id, time, name, amount, fixedDue, deleteItem, editItem, nav, index}) => {
    let date = new Date(parseFloat(time)).toDateString();
    const rent = {id, name, amount, time, fixedDue};
    return (
        <Pressable
        onPress={()=>nav.navigate('ListRentTransaction', {rent})}
        onLongPress={() => deleteItem(id)}
        style={StyleSheet.memoryListItem}>
            <Text style={StyleSheet.serialNumber}>{index}</Text>
            <View>
                <Text>{date}</Text>
                <Text>{name}</Text>
                <Text>{amount} / {fixedDue}</Text>
            </View>
            <Icon
            onPress={() => editItem(rent)}
            name="edit"
            size={30}
            color="blue"
            style={StyleSheet.editIcon}/>
        </Pressable>
    )
  }

const ListRentScreen = ({navigation}) => {
    const [rents, setRents] = useState();

    const onSnapshot = async(docs) => {
        const rents = [];
          docs.forEach((doc, i) => {
            rents.push({
              ...doc.data(),
              id: doc.id,
              index: i+1
            });
          });
          setRents(rents);
    };

    const deleteItem = (id) => {
      Alert.alert('Delete Rent', `Do you want delete this item?`, [
        {
          text: 'Delete',
          onPress: () => {
            deleteData(collection, id);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]);
    };

    const editItem = (rent) => {
        navigation.navigate('EditRent', {rent});
    };

    const addItem = (rent) => {
        navigation.navigate('CreateRent');
    };

    var unsubscribeFn;
    useEffect(() => {
        getSnapShot(collection, onSnapshot).then((unsubscribe) => {
          unsubscribeFn = unsubscribe;
        });
        // Unsubscribe from events when no longer in use
        return () => unsubscribeFn();
      }, []);

    return (
        <SafeAreaView style={StyleSheet.manageCanContainer}>
            <TouchableHighlight
            style={StyleSheet.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={addItem}>
                <Text style={StyleSheet.addCanButtonText}>Create Rent</Text>
            </TouchableHighlight>
            <View
            style={StyleSheet.memoriesView}>
              <FlatList
              data={rents}
              keyExtractor={item=>item.id}
              ListEmptyComponent={EmptyState}
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteItem} editItem={editItem} nav={navigation}/>}
              />
            </View>
        </SafeAreaView>
    )
};
export default ListRentScreen;