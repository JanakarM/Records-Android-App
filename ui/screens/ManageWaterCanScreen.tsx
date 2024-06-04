import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import firestore from '@react-native-firebase/firestore';
import DatePicker from '../components/DatePicker';
import EmptyState from '../components/EmptyState';
import dayjs from 'dayjs';

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ListItem = ({id, time, count, deleteItem}) => {
    return (
        <Pressable
        onLongPress={() => deleteItem(id)}
        style={Styles.cansListItem}>
            <Text>{new Date(parseFloat(time)).toDateString()}</Text>
            <Text>{count}</Text>
        </Pressable>
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
    const [date, setDate] = useState(dayjs());
    const [count, setCount] = useState('');
    const [canSummary, setCanSummary] = useState([]);
    const [canAdd, setcanAdd] = useState(false); // Toggles add can container

    const onSnapshot = async(docs) => {
        const waterCanEntries = [], monVsCount={}, canSummary=[], monVsStartTime={}, monVsEndTIme={};
          docs.forEach(doc => {
            const mon=MONTHS[new Date(parseFloat(doc.data().time)).getMonth()];
            monVsCount[mon]=monVsCount[mon]!=undefined?monVsCount[mon]+parseInt(doc.data().count):parseInt(doc.data().count);
            if(monVsStartTime[mon]===undefined){
              monVsStartTime[mon]=doc.data().time;
            }
            monVsEndTIme[mon]=doc.data().time;
            waterCanEntries.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          for (const month in monVsCount) {
            canSummary.push({
              month: month,
              count: monVsCount[month],
              startTime: monVsStartTime[month],
              endTime: monVsEndTIme[month]
            });
          }
          setCanSummary(canSummary);
          setwaterCanEntries(waterCanEntries);
          setLoading(false);
    }
    const addCanEntry = () => {
      if(!canAdd){
        setcanAdd(true);
        return;
      }
      if(count == ''){
        Alert.alert('Error', 'Please provide number of cans to create entry.');
        return;  
      }
      firestore()
        .collection('WaterCanEntries')
        .add({
          time: date.$d.getTime().toString(),
          count: count,
        })
        .then((a) => {
          console.log('A can added!');
          setcanAdd(false);
          });
    }
    const deleteCan = (id) => {
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
    const deleteCansForTheMonth = (startTime, endTime, month) => {
      Alert.alert('Delete Item', `Do you want delete the can entries for ${month}?`, [
        {
          text: 'Delete',
          onPress: () => {
            firestore()
            .collection('WaterCanEntries')
            .where('time', '>=', startTime)
            .where('time', '<=', endTime)
            .get()
            .then((querySnapshot) => {
              const batch = firestore().batch();
              querySnapshot.forEach(documentSnapshot => {
                batch.delete(documentSnapshot.ref);
              });
              batch.commit();
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
          .collection('WaterCanEntries')
          .orderBy('time', 'desc')
          .onSnapshot(onSnapshot);
    
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
            renderItem={({ item }) => <ListItem {...item} deleteItem={deleteCan}/>}
            />
          </View>
        )
      
    ]
    return (
        <SafeAreaView style={Styles.manageCanContainer}>
            {
              canAdd ? (
                <>
                  <DatePicker date={date} updateSelectedDate={setDate}></DatePicker>
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
            <TouchableHighlight
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={addCanEntry}>
                <Text style={Styles.addCanButtonText}>Add Cans</Text>
            </TouchableHighlight>
            <FlatList
            style={Styles.cansList}
            data={flatLists}
            renderItem={({ item }) => item}
            />
        </SafeAreaView>
    )
}