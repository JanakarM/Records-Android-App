import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, FlatList, View, Pressable, Alert, TouchableOpacity, TextInput, Switch, StyleSheet as RNStyleSheet } from 'react-native';
import DatePicker from '../components/DatePicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, getSnapShot, insertData, updateData} from '../data/DataBrokerProvider';
import {addReminder, cancelNotification, NOTIFICATION_TYPE_MEMORY} from '../utils/notificationUtil';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
};
const collection = 'Memories';

const ListItem = ({id, time, memory, deleteItem, editItem, reminderDate}) => {
    const date = new Date(parseFloat(time));
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    
    return (
        <Pressable onLongPress={() => deleteItem(id)} style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name="lightbulb-o" size={16} color={COLORS.accent} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>{memory}</Text>
            <Text style={styles.cardSubtitle}>
              {formattedDate}{reminderDate ? ` · Reminder ${new Date(parseFloat(reminderDate)).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}` : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => editItem(id, memory, parseFloat(time))}>
            <Icon name="chevron-right" size={14} color={COLORS.textLight} />
          </TouchableOpacity>
        </Pressable>
    )
}

export default function(){
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [memories, setMemories] = useState([]); // Initial empty array of memories
    const [date, setDate] = useState(new Date().getTime());
    const [memory, setMemory] = useState('');
    const [canModify, setCanModify] = useState(false); // Toggles add can container
    const [isEdit, setIsEdit] = useState(false);
    const [modifyingTransactionId, setModifyingTransactionId] = useState('');
    const [enableReminder, setEnableReminder] = useState(false);
    const [daysToRemind, setDaysToRemind] = useState('');

    const onSnapshot = async(docs) => {
        const memories = [];
          docs.forEach((doc, i) => {
            memories.push({
              ...doc.data(),
              id: doc.id,
              index: i+1
            });
          });
          setMemories(memories);
          setLoading(false);
    }
    const addMemory = () => {
      if(!canModify){
        setCanModify(true);
        return;
      }
      if(memory == ''){
        Alert.alert('Missing Information', 'Please enter a memory to save.');
        return;  
      }
      const reminderDate = enableReminder && daysToRemind ? calculateReminderDate(date, daysToRemind) : null;
      
      insertData(collection, {
        time: date,
        memory: memory,
        reminderDate: reminderDate ? reminderDate.getTime().toString() : null
      }, (doc) => {
        setCanModify(false);
        
        // Schedule reminder if enabled
        if (reminderDate) {
          addReminder(
            'Memory Reminder', 
            `Reminder: ${memory.length > 50 ? memory.substring(0, 50) + '...' : memory}`, 
            doc.id,
            reminderDate,
            NOTIFICATION_TYPE_MEMORY
          );
          
          Alert.alert('Memory Saved', `Reminder set for ${reminderDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`);
        }
      });
    }
    const deleteMemory = (id) => {
      Alert.alert('Delete Memory', 'Are you sure you want to delete this memory?', [
        {
          text: 'Delete',
          onPress: () => {
            // Find the memory item to check if it has a reminder
            const memoryItem = memories.find(item => item.id === id);
            
            // If the memory has a reminder, cancel the associated notification
            if (memoryItem && memoryItem.reminderDate) {
              // Cancel notification using the memory's ID and type
              cancelNotification(id, NOTIFICATION_TYPE_MEMORY);
            }
            
            // Delete the memory data
            deleteData(collection, id);
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        }
      ]);
    }
    const updateItem = () => {
      Alert.alert('Update Memory', 'Save changes to this memory?', [
        {
          text: 'Update',
          onPress: () => {
            const reminderDate = enableReminder && daysToRemind ? calculateReminderDate(date, daysToRemind) : null;
            
            // Find the memory item to check if it already has a reminder
            const memoryItem = memories.find(item => item.id === modifyingTransactionId);
            
            // If the memory had a previous reminder, cancel it first
            if (memoryItem && memoryItem.reminderDate) {
              // Cancel the existing notification
              cancelNotification(modifyingTransactionId, NOTIFICATION_TYPE_MEMORY);
              // Notification cancelled
            }
            
            updateData(collection, modifyingTransactionId, {
              time: date,
              memory: memory,
              reminderDate: reminderDate ? reminderDate.getTime().toString() : null
            }, () => {
              setCanModify(false);
              setIsEdit(false);
              
              // Schedule reminder if enabled
              if (reminderDate) {
                addReminder(
                  'Memory Reminder', 
                  `Reminder: ${memory.length > 50 ? memory.substring(0, 50) + '...' : memory}`, 
                  modifyingTransactionId,
                  reminderDate,
                  NOTIFICATION_TYPE_MEMORY
                );
                
                Alert.alert('Memory Updated', `Reminder set for ${reminderDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`);
              }
            });
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        }
      ]);
    }
    const editItem = (id, memory, time) => {
      // Find the memory item to get its reminder settings
      const memoryItem = memories.find(item => item.id === id);
      
      setCanModify(true);
      setIsEdit(true);
      setMemory(memory);
      setDate(time);
      setModifyingTransactionId(id);
      
      // Set reminder state based on existing data
      if (memoryItem && memoryItem.reminderDate) {
        setEnableReminder(true);
        const reminderDate = new Date(parseFloat(memoryItem.reminderDate));
        const creationDate = new Date(parseFloat(time));
        const diffTime = Math.abs(reminderDate - creationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysToRemind(diffDays.toString());
      } else {
        setEnableReminder(false);
        setDaysToRemind('');
      }
    }
    // Helper function to calculate reminder date based on days to remind
    const calculateReminderDate = (baseDate, days) => {
      const reminderDate = new Date(parseFloat(baseDate));
      reminderDate.setDate(reminderDate.getDate() + parseInt(days));
      return reminderDate;
    };
    
    let unsubscribeFn = null;
    useEffect(() => {
      getSnapShot(collection, onSnapshot).then((unsubscribe) => {
        unsubscribeFn = unsubscribe;
      });
      // Unsubscribe from events when no longer in use
      return () => unsubscribeFn()
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            {/* Form */}
            {canModify && (
              <View style={styles.formCard}>
                <DatePicker selectedDate={new Date(date)} onDateChange={(dt) => setDate(dt.getTime())} />
                <TextInput
                  value={memory}
                  onChangeText={c=>setMemory(c)}
                  style={styles.textInput}
                  placeholder='What do you want to remember?'
                  placeholderTextColor={COLORS.textLight}
                  multiline
                />
                <View style={styles.reminderRow}>
                  <Icon name="bell-o" size={14} color={COLORS.accent} style={{marginRight: 8}} />
                  <Text style={styles.formLabel}>Remind me</Text>
                  <Switch
                    value={enableReminder}
                    onValueChange={setEnableReminder}
                    trackColor={{false: '#ddd', true: COLORS.accent + '50'}}
                    thumbColor={enableReminder ? COLORS.accent : '#f4f3f4'}
                  />
                </View>
                {enableReminder && (
                  <TextInput
                    value={daysToRemind}
                    onChangeText={c=>setDaysToRemind(c)}
                    style={styles.textInput}
                    placeholder='Days from now'
                    placeholderTextColor={COLORS.textLight}
                    keyboardType='number-pad'
                  />
                )}
              </View>
            )}

            {/* List */}
            <FlatList
              data={memories}
              keyExtractor={item=>item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Icon name="lightbulb-o" size={40} color={COLORS.textLight} />
                  <Text style={styles.emptyText}>No memories yet</Text>
                </View>
              }
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteMemory} editItem={editItem}/>}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={isEdit ? updateItem : addMemory}>
              <Icon name={isEdit ? "check" : (canModify ? "check" : "plus")} size={20} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  formCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  formLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  textInput: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    marginTop: 10,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
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