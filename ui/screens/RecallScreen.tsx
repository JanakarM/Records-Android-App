import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import firestore from '@react-native-firebase/firestore';
import DatePicker from '../components/DatePicker';
import dayjs from 'dayjs';

const ListItem = ({id, time, memory, deleteItem}) => {
    return (
        <Pressable
        onLongPress={() => deleteItem(id)}
        style={Styles.memoryListItem}>
            <Text>{new Date(parseFloat(time)).toDateString()}</Text>
            <Text>{memory}</Text>
        </Pressable>
    )
}

export default function(){
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [memories, setMemories] = useState([]); // Initial empty array of waterCanEntries
    const [date, setDate] = useState(dayjs());
    const [memory, setMemory] = useState('');
    const [canAdd, setCanAdd] = useState(false); // Toggles add can container

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
    const addCanEntry = () => {
      if(!canAdd){
        setCanAdd(true);
        return;
      }
      if(memory == ''){
        Alert.alert('Error', 'Please provide a memory to create entry.');
        return;  
      }
      firestore()
        .collection('Memories')
        .add({
          time: date.$d.getTime().toString(),
          memory: memory,
        })
        .then((a) => {
          console.log('A memory added!');
          setCanAdd(false);
          });
    }
    const deleteMemory = (id) => {
      Alert.alert('Delete Item', 'Do you want delete this item?', [
        {
          text: 'Delete',
          onPress: () => {
            firestore()
            .collection('WaterCanEntries')
            .doc(id)
            .delete()
            .then(() => {
              console.log('User deleted!' + id);
            }).catch((err) => {
              console.log(err);
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
    useEffect(() => {
      const subscriber = firestore()
        .collection('Memories')
        .orderBy('time', 'desc')
        .onSnapshot(onSnapshot);
  
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);
    return (
        <SafeAreaView style={Styles.manageCanContainer}>
            {
              canAdd ? (
                <>
                  <DatePicker date={date} updateSelectedDate={setDate}></DatePicker>
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
            <TouchableHighlight
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={addCanEntry}>
                <Text style={Styles.addCanButtonText}>Add Memory</Text>
            </TouchableHighlight>
            <View
            style={Styles.memoriesView}>
              <Text>Memories</Text>
              <FlatList
              data={memories}
              keyExtractor={item=>item.id}
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteMemory}/>}
              />
            </View>
        </SafeAreaView>
    )
}