import * as React from 'react';
import { Text, Button, SafeAreaView, FlatList, View, TouchableHighlight, Image } from 'react-native';
import Styles from '../StyleSheet';

export default function({navigation}){
    return (
        <SafeAreaView style={Styles.container}>
            {/* <TouchableHighlight 
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('ManageCan')}>
                <Text style={Styles.manageCanText}>Manage Cans</Text>
            </TouchableHighlight> */}
            <TouchableHighlight 
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('Recall')}>
                <Text style={Styles.manageCanText}>Manage Memories</Text>
            </TouchableHighlight>
            <TouchableHighlight 
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('ChitFund')}>
                <Text style={Styles.manageCanText}>Manage Chit Funds</Text>
            </TouchableHighlight>
            <TouchableHighlight 
            style={Styles.manageCanButton}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('CreateRent')}>
                <Text style={Styles.manageCanText}>Manage Rent</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}