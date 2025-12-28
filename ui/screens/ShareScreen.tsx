import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight } from 'react-native';
import Styles from '../StyleSheet';
import EmptyState from '../components/EmptyState';
import {deleteData, getSnapShot, insertData, getSnapShotAll, getLoginId} from '../data/DataBrokerProvider';
import DropDown from '../components/DropDown';

const userCollection = 'Users';
const shareCollection = 'Share';

const ListItem = ({share: {id, sharedWith}, deleteItem}) => {
    return (
        <Pressable
        onLongPress={() => deleteItem(id)}
        style={Styles.memoryListItem}>
            <Text>{sharedWith}</Text>
        </Pressable>
    )
}
export default function(){
    const [users, setUsers] = useState([]); // Initial empty array of users
    const [canShareWith, setCanShareWith] = useState([]); // Initial empty array of users
    const [sharedWith, setSharedWith] = useState([]); // Initial empty array of shared
    const [user, setUser] = useState('');

    const updateCanShareWith = () => {
      let emails = sharedWith.map(share => share.sharedWith);
      const canShareWith = users.filter(user => !emails.includes(user.email));
      setCanShareWith(canShareWith);
    }
    const onUserSnapshot = async(docs) => {
        const users = [];
          docs.forEach(doc => {
            users.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setUsers(users);
    }
    const onShareSnapshot = async(docs) => {
        const sharedWith = [];
          docs.forEach(doc => {
            sharedWith.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setSharedWith(sharedWith);
    }
    const shareData = () => {
      if(!user){
        Alert.alert('Error', 'Please provide a user to share data with.');
        return;  
      }
      insertData('Share', {
          time: new Date().getTime(),
          sharedWith: user
      }, () => setUser(null));
    }
    const deleteItem = (id) => {
      Alert.alert('Delete Item', 'Do you want delete this item?', [
        {
          text: 'Delete',
          onPress: () => {
            deleteData(shareCollection, id);
          }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        }
      ]);
    }
    useEffect(() => {
        const subscriber = getSnapShotAll(userCollection, onUserSnapshot, [['userId', 'not-in', [getLoginId()]]]);
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
        }, []);

    useEffect(() => {
        const subscriber = getSnapShot(shareCollection, onShareSnapshot);
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
        }, []);

    useEffect(() => {
      updateCanShareWith();
    }, [users, sharedWith]);

    return (
        <SafeAreaView style={Styles.manageCanContainer}>
            <View
            style={Styles.memoriesView}>
              <DropDown 
                data={canShareWith}
                labelFd='email'
                valueFd='email'
                value={user}
                setValue={(a) => setUser(a)}
              />
            </View>
            <TouchableHighlight
              style={Styles.manageCanButton}
              underlayColor="#DDDDDD"
              onPress={shareData}
              >
                <Text style={Styles.addCanButtonText}>Share</Text>
            </TouchableHighlight>
            <View
            style={Styles.memoriesView}>
              <Text style={Styles.listHeading}>Shared with</Text>
              <FlatList
              data={sharedWith}
              keyExtractor={item=>item.id}
              ListEmptyComponent={EmptyState}
              renderItem={({ item }) => <ListItem share={item} deleteItem={deleteItem}/>}
              />
            </View>
        </SafeAreaView>
    )
}