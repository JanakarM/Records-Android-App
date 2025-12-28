import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, FlatList, Pressable, TouchableOpacity, View, StyleSheet as RNStyleSheet } from "react-native";
import { Text } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { deleteData, getSnapShot } from "../data/DataBrokerProvider";
import { getScheduledNotifications, NOTIFICATION_TYPE_RENT } from "../utils/notificationUtil";

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
};
const collection = 'Rent';

const ListItem = ({id, time, name, amount, fixedDue, remindOnDay, deleteItem, editItem, nav, nextReminderDate}) => {
    const date = new Date(parseFloat(time));
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const rent = {id, name, amount, time, fixedDue, remindOnDay};
    
    return (
        <Pressable
          onPress={()=>nav.navigate('ListRentTransaction', {rent})}
          onLongPress={() => deleteItem(id)}
          style={styles.card}
        >
          <View style={styles.iconWrap}>
            <Icon name="home" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
            <Text style={styles.cardSubtitle}>
              {formattedDate}{nextReminderDate ? ` · Reminder ${new Date(nextReminderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}` : ''}
            </Text>
          </View>
          <Text style={styles.amount}>₹{fixedDue}</Text>
          <TouchableOpacity onPress={() => editItem(rent)}>
            <Icon name="chevron-right" size={14} color={COLORS.textLight} />
          </TouchableOpacity>
        </Pressable>
    )
  }

const ListRentScreen = ({navigation}) => {
    const [rents, setRents] = useState([]);
    const [nextReminderDates, setNextReminderDates] = useState({});

    const onSnapshot = async(docs) => {
        const rents = [];
        docs.forEach((doc, i) => {
          rents.push({ ...doc.data(), id: doc.id, index: i+1 });
        });
        setRents(rents);
        fetchNextReminderDates(rents);
    };

    const fetchNextReminderDates = (rentsList) => {
      getScheduledNotifications((scheduledNotifications) => {
        const reminderDates = {};
        scheduledNotifications.forEach(notification => {
          if (notification.id && notification.id.startsWith(`${NOTIFICATION_TYPE_RENT}_`)) {
            const rentId = notification.id.substring(NOTIFICATION_TYPE_RENT.length + 1);
            reminderDates[rentId] = notification.date;
          }
        });
        setNextReminderDates(reminderDates);
      });
    };

    const deleteItem = (id) => {
      Alert.alert('Delete', 'Delete this entry?', [
        { text: 'Delete', style: 'destructive', onPress: () => deleteData(collection, id) },
        { text: 'Cancel', style: 'cancel' }
      ]);
    };

    const editItem = (rent) => navigation.navigate('EditRent', {rent});
    const addItem = () => navigation.navigate('CreateRent');

    var unsubscribeFn;
    useEffect(() => {
        getSnapShot(collection, onSnapshot).then((unsubscribe) => {
          unsubscribeFn = unsubscribe;
        });
        return () => unsubscribeFn && unsubscribeFn();
      }, []);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
              data={rents}
              keyExtractor={item=>item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Icon name="home" size={40} color={COLORS.textLight} />
                  <Text style={styles.emptyText}>No tenants yet</Text>
                </View>
              }
              renderItem={({ item }) => <ListItem 
                {...item} 
                deleteItem={deleteItem} 
                editItem={editItem} 
                nav={navigation}
                nextReminderDate={nextReminderDates[item.id]}
              />}
            />
            <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={addItem}>
              <Icon name="plus" size={20} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    )
};

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.accent + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 12,
  },
});

export default ListRentScreen;
