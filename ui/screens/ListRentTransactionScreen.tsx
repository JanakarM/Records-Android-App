import { FlatList, TouchableHighlight, View, Pressable, Alert } from "react-native";
import { Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import StyleSheet from "../StyleSheet";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteData, getSnapShot } from "../utils/firestoreBroker";
import EmptyState from '../components/EmptyState';

const collection = 'RentTransaction';

const ListItem = ({id, time, due, deleteItem, editItem, index}) => {
  let date = new Date(time).toDateString();
  return (
      <Pressable
      onLongPress={() => deleteItem(id)}
      style={StyleSheet.memoryListItem}>
          <Text style={StyleSheet.serialNumber}>{index}</Text>
          <View>
              <Text>{date}</Text>
              <Text>{due}</Text>
          </View>
          <Icon
          onPress={() => editItem({id, due, time})}
          name="edit"
          size={30}
          color="blue"
          style={StyleSheet.editIcon}/>
      </Pressable>
  )
}

const ListRentTransactionScreen = ({route, navigation}) => {
    const {id:rentId} = route.params.rent;
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
      navigation.navigate('EditRentTransaction', {rentTransaction: {...rentTransaction, rent: route.params.rent}});
    };

    const addItem = () => {
      navigation.navigate('CreateRentTransaction', {rent: route.params.rent});
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

    var unsubscribeFn;
    useEffect(() => {
      getSnapShot(collection, onSnapshot, [[
        'rentId', '==', rentId
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
          <Text style={StyleSheet.addCanButtonText}>Pay Rent Due</Text>
      </TouchableHighlight>
      <View
      style={StyleSheet.memoriesView}>
        <Text style={StyleSheet.listHeading}>Dues</Text>
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

export default ListRentTransactionScreen;