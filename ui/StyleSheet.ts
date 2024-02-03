import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
  
  export default StyleSheet.create({
    container: {
      flex: 1,
      gap: 50,
      backgroundColor: 'silver',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cansList: {
      marginTop: 15
    },
    cansSummaryView: {
      marginTop: 25
    },
    cansListItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomColor: 'white',
      borderBottomWidth: 0.5,
      marginTop: 10,
      backgroundColor: 'lightgrey'
    },
    canSummaryItem: {
      padding: 10,
      borderBottomColor: 'white',
      borderBottomWidth: 0.5,
      marginTop: 10,
      backgroundColor: 'lightgrey'
    },
    manageCanContainer: {
      flex: 1,
      gap: 10,
      backgroundColor: 'silver',
      padding: 15
    },
    manageCanButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'grey'
    },
    addCanButton: {
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: 'green'
    },
    addCanButtonText: {
      color: 'white'
    },
    manageCanText: {
        color: 'white'
    },
    signInButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15
    },
    signInText: {
      color: 'black'
    },
    datePicker: {
      backgroundColor: '#F5FCFF'
    },
    numberOfCansInput: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: 'white',
      borderRadius: 10,
      color: 'black'
    }
  });