import * as React from 'react';
import { Text, Button, SafeAreaView, FlatList, View, TouchableHighlight, Image } from 'react-native';
import Styles from '../StyleSheet';
export default function({navigation}){
    return (
        <SafeAreaView style={Styles.container}>
            <TouchableHighlight 
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('ManageCan')}>
                <Text style={Styles.manageCanText}>Manage Cans</Text>
            </TouchableHighlight>
            <TouchableHighlight 
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('Recall')}>
                <Text style={Styles.manageCanText}>Recall</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}