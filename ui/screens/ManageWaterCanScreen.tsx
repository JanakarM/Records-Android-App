import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import DatePicker from '../components/DatePicker';
import EmptyState from '../components/EmptyState';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, deleteMulipleData, getSnapShot, insertData, updateData} from '../utils/firestoreBroker';

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const collection = 'WaterCanEntries';

const ListItem = ({id, time, count, deleteItem, editItem}) => {
    return (
        <View style={{flexDirection: 'row', borderBottomWidth: 0.5}}>
          <Pressable
          onLongPress={() => deleteItem(id)}
          style={{...Styles.cansListItem, width:'90%', borderBottomWidth: 0}}>
              <Text>{new Date(parseFloat(time)).toDateString()}</Text>
              <Text>{count}</Text>
          </Pressable>
          <Icon 
          onPress={() => editItem(id, count, parseFloat(time))}
          name="edit"
          size={25}
          color="blue"
          style={Styles.editIcon}
          />
        </View>
    )
}

const SummayListItem = ({month, count, startTime, endTime, deleteItem}) => {
  return (
      <Pressable
      onLongPress={() => deleteItem(startTime, endTime, month)}
      style={Styles.cansListItem}>
          <Text>{month}</Text>
          <Text>{count}</Text>
      </Pressable>
  )
}

export default function(){
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [waterCanEntries, setwaterCanEntries] = useState([]); // Initial empty array of waterCanEntries
    const [date, setDate] = useState(new Date().getTime());
    const [count, setCount] = useState('');
    const [canSummary, setCanSummary] = useState([]);
    const [canModify, setCanModify] = useState(false); // Toggles add can container
    const [isEdit, setIsEdit] = useState(false);
    const [modifyingTransactionId, setModifyingTransactionId] = useState('');

    const onSnapshot = async(docs) => {
        const waterCanEntries = [], monVsCount={}, canSummary=[], monVsStartTime={}, monVsEndTIme={};
          docs.forEach(doc => {
            const mon=MONTHS[new Date(parseFloat(doc.data().time)).getMonth()];
            monVsCount[mon]=monVsCount[mon]!=undefined?monVsCount[mon]+parseInt(doc.data().count):parseInt(doc.data().count);
            if(monVsEndTIme[mon]===undefined){
              monVsEndTIme[mon]=doc.data().time;
            }
            monVsStartTime[mon]=doc.data().time;
            waterCanEntries.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          for (const month in monVsCount) {
            canSummary.push({
              month: month,
              count: monVsCount[month],
              startTime: parseFloat(monVsStartTime[month]),
              endTime: parseFloat(monVsEndTIme[month])
            });
          }
          setCanSummary(canSummary);
          setwaterCanEntries(waterCanEntries);
          setLoading(false);
    }
    const addCanEntry = () => {
      if(!canModify){
        setCanModify(true);
        return;
      }
      if(count == ''){
        Alert.alert('Error', 'Please provide number of cans to create entry.');
        return;  
      }
      insertData(collection, {
        time: date,
        count: count,
      }, () => setCanModify(false));
    }
    const deleteCan = (id) => {
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
    const deleteCansForTheMonth = (startTime, endTime, month) => {
      Alert.alert('Delete Item', `Do you want delete the can entries for ${month}?`, [
        {
          text: 'Delete',
          onPress: () => {
            deleteMulipleData(collection, [
              ['time', '>=', startTime],
              ['time', '<=', endTime]
            ]);
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
              count: count
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
    const editItem = (id, count, time) => {
      setCanModify(true);
      setIsEdit(true);
      setCount(count);
      setDate(time);
      setModifyingTransactionId(id);
    }
    useEffect(() => {
        const subscriber = getSnapShot(collection, onSnapshot);
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);
    const flatLists = [
        (
              <View
              style={Styles.cansSummaryView}>
                <Text style={Styles.listHeading}>Summary</Text>
                <FlatList
                data={canSummary}
                ListEmptyComponent={EmptyState}
                renderItem={({ item }) => <SummayListItem {...item} deleteItem={deleteCansForTheMonth}/>}
                />
              </View>
        ),
        (
          <View
          style={Styles.cansEntryView}>
            <Text style={Styles.listHeading}>Watercan Entries</Text>
            <FlatList
            data={waterCanEntries}
            keyExtractor={item=>item.id}
            ListEmptyComponent={EmptyState}
            renderItem={({ item }) => <ListItem {...item} deleteItem={deleteCan} editItem={editItem}/>}
            />
          </View>
        )
      
    ]
    return (
        <SafeAreaView style={Styles.manageCanContainer}>
            {
              canModify ? (
                <>
                  <DatePicker date={date} updateSelectedDate={(dt) => setDate(dt.$d.getTime())}></DatePicker>
                  <TextInput
                  value={count}
                  onChangeText={c=>setCount(c)}
                  keyboardType='number-pad'
                  style={Styles.numberOfCansInput}
                  placeholder='Enter number of cans here.'
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
                  <Text style={Styles.addCanButtonText}>Update Cans</Text>
              </TouchableHighlight>
              :
              <TouchableHighlight
              style={Styles.manageCanButton}
              underlayColor="#DDDDDD"
              onPress={addCanEntry}>
                  <Text style={Styles.addCanButtonText}>Add Cans</Text>
              </TouchableHighlight>
            }
            <FlatList
            style={Styles.cansList}
            data={flatLists}
            renderItem={({ item }) => item}
            />
        </SafeAreaView>
    )
}