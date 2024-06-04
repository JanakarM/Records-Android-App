import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import firestore from '@react-native-firebase/firestore';
import DatePicker from '../components/DatePicker';
import EmptyState from '../components/EmptyState';
import dayjs from 'dayjs';

var nav;

const ListItem = ({id, time, amount, deleteItem}) => {
  const date = new Date(parseFloat(time)).toDateString();  
  return (
      <Pressable
      onPress={()=>nav.navigate('Recall')}
      onLongPress={() => deleteItem(id)}
      style={Styles.memoryListItem}>
          <Text>{date}</Text>
          <Text>{amount}</Text>
      </Pressable>
  )
}

export default function({route}){
    const chitFund = route.params.chitFund;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [transactions, setTransactions] = useState([]); // Initial empty array of chitFunds
    const [date, setDate] = useState(dayjs());// check new Date()
    const [amount, setAmount] = useState('');
    const [canAdd, setCanAdd] = useState(false); // Toggles add container

    const onSnapshot = async(docs) => {
        const transactions = [];
          docs.forEach(doc => {
            transactions.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setTransactions(transactions);
          setLoading(false);
    }
    const addItem = () => {
      if(!canAdd){
        setCanAdd(true);
        return;
      }
      if(amount == ''){
        Alert.alert('Error', 'Please provide a transaction amount to create entry.');
        return;  
      }
      firestore()
        .collection('ChitFundTransactions')
        .add({
          time: date.$d.getTime().toString(),
          amount: amount,
          chitFundId: chitFund.id
        })
        .then((a) => {
          console.log('A transaction added!');
          setCanAdd(false);
          });
    }
    const deleteItem = (id) => {
      Alert.alert('Delete Item', 'Do you want delete this item?', [
        {
          text: 'Delete',
          onPress: () => {
            firestore()
            .collection('ChitFundTransactions')
            .doc(id)
            .delete()
            .then(() => {
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
    useEffect(() => {
      const subscriber = firestore()
        .collection('ChitFundTransactions')
        .where('chitFundId', '==', chitFund.id)
        .orderBy('time', 'desc')
        .onSnapshot(a => onSnapshot(a), err => console.log(err));
  
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
                  value={amount}
                  onChangeText={c=>setAmount(c)}
                  style={Styles.numberOfCansInput}
                  placeholder='Enter the transaction amount.'
                  // placeholderTextColor='black'
                  />
                </>
              ) : ''
            }
            <TouchableHighlight
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={addItem}>
                <Text style={Styles.addCanButtonText}>Add Transaction</Text>
            </TouchableHighlight>
            <View
            style={Styles.memoriesView}>
              <Text style={Styles.listHeading}>Transactions of  '{chitFund.date} - {chitFund.name}' chit fund</Text>
              <FlatList
              data={transactions}
              keyExtractor={item=>item.id}
              ListEmptyComponent={EmptyState}
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteItem}/>}
              />
            </View>
        </SafeAreaView>
    )
}