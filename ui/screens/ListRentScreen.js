import { SafeAreaView } from "react-native-safe-area-context";
import StyleSheet from "../StyleSheet";
import { Alert, FlatList, Pressable, TouchableHighlight, View } from "react-native";
import { Text } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { deleteData, getSnapShot } from "../utils/firestoreBroker";
import EmptyState from '../components/EmptyState';
import { getScheduledNotifications, NOTIFICATION_TYPE_RENT } from "../utils/notificationUtil";

const collection = 'Rent';

const ListItem = ({id, time, name, amount, fixedDue, remindOnDay, deleteItem, editItem, nav, index, nextReminderDate}) => {
    let date = new Date(parseFloat(time)).toDateString();
    const rent = {id, name, amount, time, fixedDue, remindOnDay};
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
                {nextReminderDate && (
                  <Text style={{color: '#007AFF', fontSize: 12, marginTop: 4}}>
                    Next reminder: {new Date(nextReminderDate).toDateString()}
                  </Text>
                )}
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
    const [rents, setRents] = useState([]);
    const [nextReminderDates, setNextReminderDates] = useState({});

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
          fetchNextReminderDates(rents);
    };

    // Fetch next reminder dates for all rents
    const fetchNextReminderDates = (rentsList) => {
      getScheduledNotifications((scheduledNotifications) => {
        const reminderDates = {};
        
        // Filter notifications for each rent
        scheduledNotifications.forEach(notification => {
          if (notification.id && notification.id.startsWith(`${NOTIFICATION_TYPE_RENT}_`)) {
            // Extract the rent ID from the notification ID
            const rentId = notification.id.substring(NOTIFICATION_TYPE_RENT.length + 1);
            reminderDates[rentId] = notification.date;
          }
        });
        
        setNextReminderDates(reminderDates);
      });
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
        return () => unsubscribeFn && unsubscribeFn();
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
              <Text style={StyleSheet.listHeading}>Rents</Text>
              <FlatList
              data={rents}
              keyExtractor={item=>item.id}
              ListEmptyComponent={EmptyState}
              renderItem={({ item }) => <ListItem 
                {...item} 
                deleteItem={deleteItem} 
                editItem={editItem} 
                nav={navigation}
                nextReminderDate={nextReminderDates[item.id]}
              />}
              />
            </View>
        </SafeAreaView>
    )
};
export default ListRentScreen;
