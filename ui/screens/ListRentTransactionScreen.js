import { FlatList, TouchableHighlight, View, Pressable, Alert } from "react-native";
import { Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import StyleSheet from "../StyleSheet";
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteData, getSnapShot } from "../utils/firestoreBroker";
import EmptyState from '../components/EmptyState';
import { cancelNotification, getScheduledNotifications, NOTIFICATION_TYPE_RENT } from "../utils/notificationUtil";

const collection = 'RentTransaction';

// Removed interface ListItemProps

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

// Removed RentTransaction and Rent interfaces



const ListRentTransactionScreen = ({route, navigation}) => {
    const {id:rentId, name:rentName} = route.params.rent;
    const [rentTransactions, setRentTransactions] = useState([]);
    const [nextReminderDates, setNextReminderDates] = useState({});


    const onSnapshot = (docs) => {
      const rentTransactions = [];
        docs.forEach((doc, i) => {
          rentTransactions.push({
            ...doc.data(),
            id: doc.id,
            index: i+1
          });
        });
      setRentTransactions(rentTransactions);
      fetchNextReminderDates(rentId);
    }

    const editItem = (rentTransaction) => {
      navigation.navigate('EditRentTransaction', {rentTransaction: {...rentTransaction, rent: route.params.rent}});
    };

    const addItem = () => {
      navigation.navigate('CreateRentTransaction', {rent: route.params.rent});
    };

    const deleteItem = (id) => {
      Alert.alert('Delete Rent Transaction', `Do you want delete this item?`, [
        {
          text: 'Delete',
          onPress: () => {
            // Cancel notification using the rent ID with the rent type
            cancelNotification(rentId, NOTIFICATION_TYPE_RENT);
            deleteData(collection, id);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]);
    };




    // Fetch next reminder dates for this rent
    const fetchNextReminderDates = (rentId) => {
      getScheduledNotifications((scheduledNotifications) => {
        const reminderDates = {};
        
        // Filter notifications for this rent
        scheduledNotifications.forEach(notification => {
          if (notification.id && notification.id.startsWith(`${NOTIFICATION_TYPE_RENT}_${rentId}`)) {
            reminderDates[rentId] = notification.date;
          }
        });
        
        setNextReminderDates(reminderDates);
      });
    };
    
    var unsubscribeFn;
    useEffect(() => {
      // Get rent transactions for this rent
      getSnapShot(collection, onSnapshot, [[
        'rentId', '==', rentId
      ]]).then((unsubscribe) => {
        unsubscribeFn = unsubscribe;
      });
      
      // Unsubscribe from events when no longer in use
      return () => {
        unsubscribeFn && unsubscribeFn();
      }
    }, [rentId]); // Re-run effect if rentId changes
    
    // No test functions needed in production code
    
    return (
      <SafeAreaView style={StyleSheet.manageCanContainer}>
      <View>
        <TouchableHighlight
        style={StyleSheet.manageCanButton}
        underlayColor="#DDDDDD"
        onPress={addItem}>
            <Text style={StyleSheet.addCanButtonText}>Pay Rent Due</Text>
        </TouchableHighlight>
        
        {nextReminderDates[rentId] && (
          <View style={{padding: 10, alignItems: 'center'}}>
            <Text style={{color: '#007AFF', fontSize: 14}}>
              Next reminder: {new Date(nextReminderDates[rentId]).toDateString()}
            </Text>
          </View>
        )}
      </View>
      <View
      style={StyleSheet.memoriesView}>
        <Text style={StyleSheet.listHeading}>Dues</Text>
        <FlatList
        data={rentTransactions}
        keyExtractor={item=>item.id}
        ListEmptyComponent={EmptyState}
        renderItem={({ item }) => <ListItem 
          {...item} 
          deleteItem={deleteItem} 
          editItem={editItem} 
        />}
        />
      </View>
  </SafeAreaView>
    );
};

export default ListRentTransactionScreen;