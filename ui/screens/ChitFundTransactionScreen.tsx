import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import DatePicker from '../components/DatePicker';
import EmptyState from '../components/EmptyState';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, getSnapShot, insertData, updateData} from '../utils/firestoreBroker';

const collection = 'ChitFundTransactions';

const ListItem = ({id, time, amount, deleteItem, editItem}) => {
  const date = new Date(parseFloat(time)).toDateString();  
  return (
      <Pressable
      onLongPress={() => deleteItem(id)}
      style={Styles.memoryListItem}>
          <Text>{date}</Text>
          <Text>{amount}</Text>
          <Icon 
          onPress={() => editItem(id, amount, parseFloat(time))}
          name="edit"
          size={30}
          color="blue"
          style={Styles.editIcon}/>
      </Pressable>
  )
}

export default function({route}){
    const chitFund = route.params.chitFund;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [transactions, setTransactions] = useState([]); // Initial empty array of chitFunds
    const [date, setDate] = useState(new Date().getTime());// check new Date()
    const [amount, setAmount] = useState('');
    const [amountPaidTillDate, setAmountPaidTillDate] = useState(0);
    const [canModify, setCanModify] = useState(false); // Toggles add container
    const [isEdit, setIsEdit] = useState(false);
    const [modifyingTransactionId, setModifyingTransactionId] = useState('');

    const onSnapshot = async(docs) => {
      const transactions = [];
      let paid = 0;
        docs.forEach(doc => {
          transactions.push({
            ...doc.data(),
            id: doc.id,
          });
          paid += parseInt(doc.data().amount);
        });
        setTransactions(transactions);
        setAmountPaidTillDate(paid);
        setLoading(false);
    }
    const addItem = () => {
      if(!canModify){
        setCanModify(true);
        return;
      }
      if(amount == ''){
        Alert.alert('Error', 'Please provide a transaction amount to create entry.');
        return;  
      }
      insertData(collection, {
          time: date,
          amount: amount,
          chitFundId: chitFund.id
        }, () => setCanModify(false));
    }
    const deleteItem = (id) => {
      Alert.alert('Delete Item', 'Do you want delete this item?', [
        {
          text: 'Delete',
          onPress: () => {
            deleteData(collection, id, () => {
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
    const updateItem = () => {
      Alert.alert('Update Item', 'Do you want update this item?', [
        {
          text: 'Update',
          onPress: () => {
            updateData(collection, modifyingTransactionId, {
              time: date,
              amount: amount
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
    const editItem = (id, amount, time) => {
      setCanModify(true);
      setIsEdit(true);
      setAmount(amount);
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
                  value={amount}
                  onChangeText={c=>setAmount(c)}
                  style={Styles.numberOfCansInput}
                  placeholder='Enter the transaction amount.'
                  keyboardType='number-pad'
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
                  <Text style={Styles.addCanButtonText}>Update Transaction</Text>
              </TouchableHighlight> 
              :
              <TouchableHighlight
              style={Styles.manageCanButton}
              underlayColor="#DDDDDD"
              onPress={addItem}>
                  <Text style={Styles.addCanButtonText}>Add Transaction</Text>
              </TouchableHighlight>
            }
            <View 
            style={Styles.cansListItem}
            >
              <Text style={Styles.listHeading}>Amount paid till date</Text>
              <Text>{amountPaidTillDate}</Text>
            </View>
            <View
            style={Styles.memoriesView}>
              <Text style={Styles.listHeading}>Transactions</Text>
              <FlatList
              data={transactions}
              keyExtractor={item=>item.id}
              ListEmptyComponent={EmptyState}
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteItem} editItem={editItem}/>}
              />
            </View>
        </SafeAreaView>
    )
}