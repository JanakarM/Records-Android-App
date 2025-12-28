import React, {useEffect, useState} from 'react';
import { Text, Button, SafeAreaView, FlatList, View, Pressable, Alert, TouchableHighlight, TextInput, ScrollView } from 'react-native';
import Styles from '../StyleSheet';
import {setUserId as setOrgId, getSnapShotAll, getLoginId, getUserId, getLoginEmail} from '../data/DataBrokerProvider';
import DropDown from '../components/DropDown';

const userCollection = 'Users';
const shareCollection = 'Share';

export default function({navigation}){
  const [users, setUsers] = useState([]);
  const [shared, setShared] = useState([]); // Initial empty array of shared
  const [sharedOrg, setSharedOrg] = useState([]); // Initial empty array of shared
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');

    const updateShared = () => {
      let sharedIds = shared.map(s => s.userId);
      let shareData = users.filter(user => sharedIds.includes(user.userId) || user.userId == getLoginId());
      setSharedOrg(shareData);
    }
    getUserId().then(userId => {
      setUserId(userId);
    });
    const onUserSnapshot = (docs) => {
        let users = [];
        docs.forEach(doc => {
          users.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setUsers(users);
    }
    const onShareSnapshot = (docs) => {
        let shared = [];
          docs.forEach(doc => {
            shared.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setShared(shared);
    }
    const switchOrg = () => {
       setOrgId(user);
        navigation.navigate('Home');
    }
    useEffect(() => {
        const subscriber = getSnapShotAll(userCollection, onUserSnapshot);
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
        }, []);

    useEffect(() => {
        const subscriber = getSnapShotAll(shareCollection, onShareSnapshot, [['sharedWith', '==', getLoginEmail()]]);
        // Unsubscribe from events when no longer in use
        return () => subscriber();
        }, []);
    
    useEffect(() => updateShared(), [users, shared]);
    return (
        <SafeAreaView style={Styles.manageCanContainer}>
            <View
            style={Styles.memoriesView}>
              <DropDown 
                data={sharedOrg}
                setValue={(a) => {setUser(a);}}
                labelFd='email'
                valueFd='userId'
                value={userId}
              />
            </View>
            <TouchableHighlight
              style={Styles.manageCanButton}
              underlayColor="#DDDDDD"
              onPress={switchOrg}
              >
                <Text style={Styles.addCanButtonText}>Switch Org</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}