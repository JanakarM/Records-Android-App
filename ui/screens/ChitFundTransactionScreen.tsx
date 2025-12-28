import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, FlatList, View, Pressable, Alert, TouchableOpacity, TextInput, StyleSheet as RNStyleSheet } from 'react-native';
import DatePicker from '../components/DatePicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, getSnapShot, insertData, updateData} from '../data/DataBrokerProvider';

const collection = 'ChitFundTransactions';

const ListItem = ({id, time, amount, deleteItem, editItem}) => {
  const date = new Date(parseFloat(time));
  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  
  return (
      <Pressable
        onLongPress={() => deleteItem(id)}
        style={styles.card}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Icon name="money" size={18} color="#9c27b0" />
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.paymentLabel}>Payment</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.amountText}>₹{amount}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => editItem(id, amount, parseFloat(time))}
          style={styles.editButton}
        >
          <Icon name="pencil" size={16} color="#1976d2" />
        </TouchableOpacity>
      </Pressable>
  )
}

export default function({route}){
    const chitFund = route.params.chitFund;
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [date, setDate] = useState(new Date().getTime());
    const [amount, setAmount] = useState('');
    const [amountPaidTillDate, setAmountPaidTillDate] = useState(0);
    const [canModify, setCanModify] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [modifyingTransactionId, setModifyingTransactionId] = useState('');

    const onSnapshot = async(docs) => {
      const transactions = [];
      let paid = 0;
        docs.forEach((doc, i) => {
          transactions.push({
            ...doc.data(),
            id: doc.id,
            index: i+1
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
          style: 'destructive',
          onPress: () => {
            deleteData(collection, id, () => {
              setCanModify(false);
              setIsEdit(false);
            });
          },
        },
        { text: 'Cancel', style: 'cancel' }
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
        { text: 'Cancel', style: 'cancel' }
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
      getSnapShot(collection, onSnapshot, [[
        'chitFundId', '==', chitFund.id
      ]]).then((unsubscribe) => {
        unsubscribeFn = unsubscribe;
      });
      return () => unsubscribeFn()
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Total */}
            <View style={styles.headerCard}>
              <Icon name="users" size={28} color="#9c27b0" />
              <Text style={styles.headerTitle}>{chitFund.name}</Text>
              <View style={styles.totalBadge}>
                <Text style={styles.totalLabel}>Total Paid</Text>
                <Text style={styles.totalAmount}>₹{amountPaidTillDate}</Text>
              </View>
            </View>

            {/* Form Card */}
            {canModify && (
              <View style={styles.formCard}>
                <Text style={styles.formLabel}>Date</Text>
                <DatePicker selectedDate={new Date(date)} onDateChange={(dt) => setDate(dt.getTime())} />
                
                <Text style={[styles.formLabel, {marginTop: 16}]}>Amount</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="rupee" size={16} color="#666" style={{marginRight: 10}} />
                  <TextInput
                    value={amount}
                    onChangeText={c=>setAmount(c)}
                    style={styles.textInput}
                    placeholder='Enter the transaction amount'
                    placeholderTextColor='#999'
                    keyboardType='number-pad'
                  />
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.8}
              onPress={isEdit ? updateItem : addItem}
            >
              <Icon name={isEdit ? "check" : "plus"} size={16} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.addButtonText}>{isEdit ? 'Update Transaction' : (canModify ? 'Save Transaction' : 'Add Transaction')}</Text>
            </TouchableOpacity>

            {/* List */}
            <FlatList
              data={transactions}
              keyExtractor={item=>item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="money" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>No transactions yet</Text>
                  <Text style={styles.emptySubtext}>Tap the button above to add one</Text>
                </View>
              }
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteItem} editItem={editItem}/>}
            />
        </SafeAreaView>
    )
}

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#f3e5f5',
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
  totalBadge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: '#888',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9c27b0',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#9c27b0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#9c27b0',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  paymentLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardRight: {
    marginRight: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9c27b0',
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