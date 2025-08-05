import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView, Switch } from 'react-native';
import Styles from '../StyleSheet';
import DatePicker from '../components/DatePicker';
import EmptyState from '../components/EmptyState';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, getSnapShot, insertData, updateData} from '../utils/firestoreBroker';
import {addReminder} from '../utils/notificationUtil';
import StyleSheet from '../StyleSheet';

const collection = 'Memories';

const ListItem = ({id, time, memory, deleteItem, editItem, index, reminderDate}) => {
    return (
        <Pressable
        onLongPress={() => deleteItem(id)}
        style={Styles.memoryListItem}>
            <Text style={StyleSheet.serialNumber}>{index}</Text>
            <View>
              <Text>{new Date(parseFloat(time)).toDateString()}</Text>
              <Text style={{maxWidth: '90%'}}>{memory}</Text>
              {reminderDate && (
                <Text style={{color: '#007AFF', fontSize: 12, marginTop: 4}}>
                  Reminder set for: {new Date(parseFloat(reminderDate)).toDateString()}
                </Text>
              )}
            </View>
            <Icon 
            onPress={() => editItem(id, memory, parseFloat(time))}
            name="edit"
            size={25}
            color="blue"
            style={Styles.editIcon}
            />
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
        Alert.alert('Error', 'Please provide a memory to create entry.');
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
            { id: doc.id, type: 'memory' },
            reminderDate
          );
          
          Alert.alert('Success', `Memory added with reminder set for ${reminderDate.toDateString()}`);
        }
      });
    }
    const deleteMemory = (id) => {
      Alert.alert('Delete Item', 'Do you want delete this item?', [
        {
          text: 'Delete',
          onPress: () => {
            deleteData(collection, id);
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        }
      ]);
    }
    const updateItem = () => {
      Alert.alert('Update Item', 'Do you want update this item?', [
        {
          text: 'Update',
          onPress: () => {
            const reminderDate = enableReminder && daysToRemind ? calculateReminderDate(date, daysToRemind) : null;
            
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
                  { id: modifyingTransactionId, type: 'memory' },
                  reminderDate
                );
                
                Alert.alert('Success', `Memory updated with reminder set for ${reminderDate.toDateString()}`);
              }
            });
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
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
        <SafeAreaView style={Styles.manageCanContainer}>
            {
              canModify ? (
                <>
                  <DatePicker date={date} updateSelectedDate={(dt) => setDate(dt.$d.getTime())}></DatePicker>
                  <TextInput
                  value={memory}
                  onChangeText={c=>setMemory(c)}
                  style={Styles.numberOfCansInput}
                  placeholder='Enter the memory to recall later.'
                  // placeholderTextColor='black'
                  />
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                    <Text style={Styles.listHeading}>Set reminder</Text>
                    <Switch
                      value={enableReminder}
                      onValueChange={setEnableReminder}
                      style={{ marginLeft: 10 }}
                    />
                  </View>
                  
                  {enableReminder && (
                    <>
                      <Text style={Styles.listHeading}>Days to remind after</Text>
                      <TextInput
                        value={daysToRemind}
                        onChangeText={c=>setDaysToRemind(c)}
                        style={Styles.numberOfCansInput}
                        placeholder='Enter number of days after to remind'
                        keyboardType='number-pad'
                      />
                      {daysToRemind ? (
                        <Text style={{ color: '#007AFF', marginTop: 5 }}>
                          Reminder will be set for: {new Date(calculateReminderDate(date, daysToRemind)).toDateString()}
                        </Text>
                      ) : null}
                    </>
                  )}
                </>
              ) : ''
            }
            {
              isEdit ?
              <TouchableHighlight
              style={Styles.manageCanButton}
              underlayColor="#DDDDDD"
              onPress={updateItem}>
                  <Text style={Styles.addCanButtonText}>Update Memory</Text>
              </TouchableHighlight>
              :
              <TouchableHighlight
              style={Styles.manageCanButton}
              underlayColor="#DDDDDD"
              onPress={addMemory}>
                  <Text style={Styles.addCanButtonText}>Add Memory</Text>
              </TouchableHighlight>
            }
            <View
            style={Styles.memoriesView}>
              <Text style={Styles.listHeading}>Memories</Text>
              <FlatList
              data={memories}
              keyExtractor={item=>item.id}
              ListEmptyComponent={EmptyState}
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteMemory} editItem={editItem}/>}
              />
            </View>
        </SafeAreaView>
    )
}