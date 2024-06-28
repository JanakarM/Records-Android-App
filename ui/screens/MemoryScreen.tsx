import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import DatePicker from '../components/DatePicker';
import EmptyState from '../components/EmptyState';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, getSnapShot, insertData, updateData} from '../utils/firestoreBroker';

const collection = 'Memories';

const ListItem = ({id, time, memory, deleteItem, editItem}) => {
    return (
        <Pressable
        onLongPress={() => deleteItem(id)}
        style={Styles.memoryListItem}>
            <Text>{new Date(parseFloat(time)).toDateString()}</Text>
            <Text>{memory}</Text>
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

    const onSnapshot = async(docs) => {
        const memories = [];
          docs.forEach(doc => {
            memories.push({
              ...doc.data(),
              id: doc.id,
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
      insertData(collection, {
        time: date,
        memory: memory
      }, () => setCanModify(false));
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
            updateData(collection, modifyingTransactionId, {
              time: date,
              memory: memory
            }, () => {
              setCanModify(false);
              setIsEdit(false);
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
      setCanModify(true);
      setIsEdit(true);
      setMemory(memory);
      setDate(time);
      setModifyingTransactionId(id);
    }
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