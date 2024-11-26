import { FlatList, TouchableHighlight, View, Pressable, Alert } from "react-native";
import { Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import StyleSheet from "../StyleSheet";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteData, getSnapShot } from "../utils/firestoreBroker";
import EmptyState from '../components/EmptyState';

const collection = 'RentTransaction';

const ListItem = ({id, time, name, advance, deleteItem, editItem, nav, index}) => {
  let date = new Date(parseFloat(time));
  date = (date.getMonth()+1) + '/' + date.getFullYear();
  const rent = {id, name, advance, date};
  return (
      <Pressable
      onPress={()=>nav.navigate('RentTransaction', {rent})}
      onLongPress={() => deleteItem(id)}
      style={StyleSheet.memoryListItem}>
          <Text style={StyleSheet.serialNumber}>{index}</Text>
          <View>
              <Text>{date}</Text>
              <Text>{name}</Text>
          </View>
          <Icon
          onPress={() => editItem(id, name, advance, parseFloat(time))}
          name="edit"
          size={30}
          color="blue"
          style={StyleSheet.editIcon}/>
      </Pressable>
  )
}

const RentTransactionScreen = ({route, navigation}) => {
    const [id] = route.params.rent.id;
    const [rentTransactions, setRentTransactions] = useState()

    const onSnapshot = (docs) => {
      const rentTransactions = [];
        docs.forEach((doc, i) => {
          rentTransactions.push({
            ...doc.data(),
            id: doc.id,
            index: i+1
          });
        });
      setRentTransactions(rentTransactions)
    }

    const editItem = (rentTransaction) => {
      navigation.navigate('EditRent', {rent});
    };

    const addItem = (rentTransaction) => {
      navigation.navigate('CreateRent');
    };

    const deleteItem = (id) => {
      deleteData(collection, id, () => Alert.alert('Success', 'Rent deleted.'));
    };

    useEffect(() => {
      var unsubscribeFn = null;
      getSnapShot(collection, onSnapshot, [[
        'rentId', '==', chitFund.id
      ]]).then((unsubscribe) => {
        unsubscribeFn = unsubscribe;
      });
      // Unsubscribe from events when no longer in use
      return () => unsubscribeFn()
    }, []);

    return (
      <SafeAreaView style={StyleSheet.manageCanContainer}>
      <TouchableHighlight
      style={StyleSheet.manageCanButton}
      underlayColor="#DDDDDD"
      onPress={addItem}>
          <Text style={StyleSheet.addCanButtonText}>Create Rent Transaction</Text>
      </TouchableHighlight>
      <View
      style={StyleSheet.memoriesView}>
        <FlatList
        data={rentTransactions}
        keyExtractor={item=>item.id}
        ListEmptyComponent={EmptyState}
        renderItem={({ item }) => <ListItem {...item} deleteItem={deleteItem} editItem={editItem} nav={navigation}/>}
        />
      </View>
  </SafeAreaView>
    );
};

export default RentTransactionScreen;