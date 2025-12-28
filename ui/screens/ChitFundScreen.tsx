import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, FlatList, View, Pressable, Alert, TouchableOpacity, TextInput, StyleSheet as RNStyleSheet } from 'react-native';
import DatePicker from '../components/DatePicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, getSnapShot, insertData, updateData} from '../data/DataBrokerProvider';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
};
var nav;
const collection = 'ChitFunds';

const ListItem = ({id, time, name, deleteItem, editItem}) => {
  const date = new Date(parseFloat(time));
  const formattedDate = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
  const chitFund = {id, name, date: formattedDate};
  
  return (
      <Pressable
        onPress={()=>nav.navigate('ChitFundTransaction', {chitFund})}
        onLongPress={() => deleteItem(id)}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <Icon name="users" size={16} color={COLORS.accent} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
          <Text style={styles.cardSubtitle}>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => editItem(id, name, parseFloat(time))}>
          <Icon name="chevron-right" size={14} color={COLORS.textLight} />
        </TouchableOpacity>
      </Pressable>
  )
}

export default function({navigation}){
    nav = navigation;
    const [loading, setLoading] = useState(true);
    const [chitFunds, setChitFunds] = useState([]);
    const [date, setDate] = useState(new Date().getTime());
    const [name, setName] = useState('');
    const [canModify, setCanModify] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [modifyingTransactionId, setModifyingTransactionId] = useState('');

    const onSnapshot = async(docs) => {
        const chitFunds = [];
          docs.forEach((doc, i) => {
            chitFunds.push({
              ...doc.data(),
              id: doc.id,
              index: i+1
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
      insertData(collection, {
        time: date,
        name: name,
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
              name: name
            }, () => {
              setCanModify(false);
              setIsEdit(false);
            });
          },
        },
        { text: 'Cancel', style: 'cancel' }
      ]);
    }
    const editItem = (id, name, time) => {
      setCanModify(true);
      setIsEdit(true);
      setName(name);
      setDate(time);
      setModifyingTransactionId(id);
    }
    let unsubscribeFn = null;
    useEffect(() => {
      getSnapShot(collection, onSnapshot).then((unsubscribe) => {
        unsubscribeFn = unsubscribe;
      });
      return () => unsubscribeFn()
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            {canModify && (
              <View style={styles.formCard}>
                <DatePicker selectedDate={new Date(date)} onDateChange={(dt) => setDate(dt.getTime())} />
                <TextInput
                  value={name}
                  onChangeText={c=>setName(c)}
                  style={styles.textInput}
                  placeholder='Chit fund name'
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            )}

            <FlatList
              data={chitFunds}
              keyExtractor={item=>item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Icon name="users" size={40} color={COLORS.textLight} />
                  <Text style={styles.emptyText}>No chit funds yet</Text>
                </View>
              }
              renderItem={({ item }) => <ListItem {...item} deleteItem={deleteItem} editItem={editItem}/>}
            />

            <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={isEdit ? updateItem : addItem}>
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
  textInput: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    marginTop: 10,
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