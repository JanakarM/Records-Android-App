import { FlatList, TouchableOpacity, View, Pressable, Alert, StyleSheet as RNStyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteData, getSnapShot } from '../data/DataBrokerProvider';
import { cancelNotification, getScheduledNotifications, NOTIFICATION_TYPE_RENT } from "../utils/notificationUtil";

const collection = 'RentTransaction';

const ListItem = ({id, time, due, index, deleteItem, editItem}) => {
  const date = new Date(time);
  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  
  return (
      <Pressable
        onLongPress={() => deleteItem(id)}
        style={styles.card}
      >
        <View style={styles.cardLeft}>
          <View style={styles.serialBadge}>
            <Text style={styles.serialText}>#{index}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.dueLabel}>Payment</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.dueAmount}>₹{due}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => editItem({id, due, time})}
          style={styles.editButton}
        >
          <Icon name="pencil" size={16} color="#1976d2" />
        </TouchableOpacity>
      </Pressable>
  )
}

const ListRentTransactionScreen = ({route, navigation}) => {
    const {id:rentId, name:rentName} = route.params.rent;
    const [rentTransactions, setRentTransactions] = useState([]);
    const [nextReminderDates, setNextReminderDates] = useState({});

    const onSnapshot = (docs) => {
      const rentTransactions = [];
        docs.forEach((doc) => {
          rentTransactions.push({
            ...doc.data(),
            id: doc.id,
          });
        });
      // Reverse index: oldest = #1, newest = highest number
      const total = rentTransactions.length;
      rentTransactions.forEach((item, i) => {
        item.index = total - i;
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
      Alert.alert('Delete Payment', 'Are you sure you want to delete this payment record?', [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            cancelNotification(rentId, NOTIFICATION_TYPE_RENT);
            deleteData(collection, id);
          },
        },
        { text: 'Cancel', style: 'cancel' }
      ]);
    };

    const fetchNextReminderDates = (rentId) => {
      getScheduledNotifications((scheduledNotifications) => {
        const reminderDates = {};
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
      getSnapShot(collection, onSnapshot, [[
        'rentId', '==', rentId
      ]]).then((unsubscribe) => {
        unsubscribeFn = unsubscribe;
      });
      return () => {
        unsubscribeFn && unsubscribeFn();
      }
    }, [rentId]);
    
    return (
      <SafeAreaView style={styles.container}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <Icon name="home" size={28} color="#4caf50" />
          <Text style={styles.headerTitle}>{rentName}</Text>
          {nextReminderDates[rentId] && (
            <View style={styles.reminderBadge}>
              <Icon name="bell" size={12} color="#1976d2" style={{marginRight: 4}} />
              <Text style={styles.reminderText}>
                Next: {new Date(nextReminderDates[rentId]).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </Text>
            </View>
          )}
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={addItem}
        >
          <Icon name="plus" size={16} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.addButtonText}>Pay Rent Due</Text>
        </TouchableOpacity>

        {/* List */}
        <FlatList
          data={rentTransactions}
          keyExtractor={item=>item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="credit-card" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No payments yet</Text>
              <Text style={styles.emptySubtext}>Tap the button above to add one</Text>
            </View>
          }
          renderItem={({ item }) => <ListItem 
            {...item} 
            deleteItem={deleteItem} 
            editItem={editItem} 
          />}
        />
      </SafeAreaView>
    );
};

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  reminderText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    marginRight: 12,
  },
  serialBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serialText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4caf50',
  },
  cardContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  dueLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardRight: {
    marginRight: 8,
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4caf50',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
});

export default ListRentTransactionScreen;