import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import firestore from '@react-native-firebase/firestore';
import DatePicker from '../components/DatePicker';
import EmptyState from '../components/EmptyState';
import Icon from 'react-native-vector-icons/FontAwesome';

var nav;

const ListItem = ({id, time, name, deleteItem, editItem}) => {
  let date = new Date(parseFloat(time));
  date = (date.getMonth()+1) + '/' + date.getFullYear();
  const chitFund = {id, name, date};
  return (
      <Pressable
      onPress={()=>nav.navigate('ChitFundTransaction', {chitFund})}
      onLongPress={() => deleteItem(id)}
      style={Styles.memoryListItem}>
          <Text>{date}</Text>
          <Text>{name}</Text>
          <Icon 
          onPress={() => editItem(id, name, parseFloat(time))}
          name="edit"
          size={30}
          color="blue"
          style={Styles.editIcon}/>
      </Pressable>
  )
}

export default function({navigation}){
    nav = navigation;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [chitFunds, setChitFunds] = useState([]); // Initial empty array of chitFunds
    const [date, setDate] = useState(new Date().getTime());// check new Date()
    const [name, setName] = useState('');
    const [canModify, setCanModify] = useState(false); // Toggles add container
    const [isEdit, setIsEdit] = useState(false);
    const [modifyingTransactionId, setModifyingTransactionId] = useState('');

    const onSnapshot = async(docs) => {
        const chitFunds = [];
          docs.forEach(doc => {
            chitFunds.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setChitFunds(chitFunds);
          setLoading(false);
    }
    const addItem = () => {
      if(!canModify){
        setCanModify(true);
        return;
      }
      if(name == ''){
        Alert.alert('Error', 'Please provide a chit fund name to create entry.');
        return;  
      }
      firestore()
        .collection('ChitFunds')
        .add({
          time: date,
          name: name,
        })
        .then((a) => {
          console.log('A memory added!');
          setCanModify(false);
          });
    }
    const deleteItem = (id) => {
      Alert.alert('Delete Item', 'Do you want delete this item?', [
        {
          text: 'Delete',
          onPress: () => {
            firestore()
            .collection('ChitFunds')
            .doc(id)
            .delete()
            .then(() => {
              setCanModify(false);
              setIsEdit(false); // edit and delete case
              console.log('The memory deleted!' + id);
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
    const updateItem = () => {
      Alert.alert('Update Item', 'Do you want update this item?', [
        {
          text: 'Update',
          onPress: () => {
            firestore()
            .collection('ChitFunds')
            .doc(modifyingTransactionId)
            .update({
                time: date,
                name: name
              }
            )
            .then(() => {
              setCanModify(false);
              setIsEdit(false);
              console.log('The transaction is updated!' + id + ' ' + data);
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
    const editItem = (id, name, time) => {
      setCanModify(true);
      setIsEdit(true);
      setName(name);
      setDate(time);
      setModifyingTransactionId(id);
    }
    useEffect(() => {
      const subscriber = firestore()
        .collection('ChitFunds')
        .orderBy('time', 'desc')
        .onSnapshot(onSnapshot);
  
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);
    return (
        <SafeAreaView style={Styles.manageCanContainer}>
            {
              canModify ? (
                <>
                  <DatePicker date={date} updateSelectedDate={(d) => setDate(d.$d.getTime().toString())}></DatePicker>
                  <TextInput
                  value={name}
                  onChangeText={c=>setName(c)}
                  style={Styles.numberOfCansInput}
                  placeholder='Enter the name of chit fund.'
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
                <Text style={Styles.addCanButtonText}>Update Chit Fund</Text>
            </TouchableHighlight>
              :
              <TouchableHighlight
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={addItem}>
                <Text style={Styles.addCanButtonText}>Add Chit Fund</Text>
            </TouchableHighlight>
            }
            <View
            style={Styles.memoriesView}>
              <Text style={Styles.listHeading}>Chit Funds</Text>
              <FlatList
              data={chitFunds}
              keyExtractor={item=>item.id}
              ListEmptyComponent={EmptyState}
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteItem} editItem={editItem}/>}
              />
            </View>
        </SafeAreaView>
    )
}