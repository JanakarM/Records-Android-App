import * as React from 'react';
import { Text, Button, SafeAreaView, FlatList, View, TouchableHighlight } from 'react-native';
import Styles from './StyleSheet';
export default function({navigation}){
    return (
        <View style={Styles.container}>
            <Text>HomeScreen</Text>
            <TouchableHighlight 
            style={Styles.manageCanButton}
            onPress={()=>navigation.navigate('ManageCan')}>
                <Text style={Styles.manageCanText}>Manage Cans</Text>
            </TouchableHighlight>
        </View>
    )
}