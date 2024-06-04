import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
  
  export default StyleSheet.create({
    container: {
      flex: 1,
      gap: 50,
      // backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cansList: {
      marginTop: 15
    },
    cansSummaryView: {
      padding: 15,
      // backgroundColor: 'darkred'
    },
    cansEntryView: {
      marginTop: 25,
      padding: 15,
      // backgroundColor: 'darkblue'
    },
    cansListItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      // borderBottomColor: 'white',
      borderBottomWidth: 0.5,
      marginTop: 10
    },
    memoriesView: {
      marginTop: 15,
      padding: 10
    },
    memoryListItem: {
      flexDirection: 'column',
      gap: 5,
      padding: 10,
      // borderBottomColor: 'white',
      borderBottomWidth: 0.5,
      marginTop: 10
    },
    canSummaryItem: {
      padding: 10,
      // borderBottomColor: 'white',
      borderBottomWidth: 0.5,
      marginTop: 10,
      // backgroundColor: 'lightgrey'
    },
    manageCanContainer: {
      flex: 1,
      gap: 10,
      // backgroundColor: 'black',
      padding: 15
    },
    loginContainer: {
      paddingVertical: 75,
      flex: 1,
      gap: 10,
      // backgroundColor: 'silver',
      alignItems: 'center',
      paddingHorizontal: 5
    },
    appName: {
      fontSize: 30,
      fontWeight: 'bold',
      // color: 'black'
    },
    appDescription: {
      // color: 'black'
    },
    signInImage: {
      marginVertical: 30,
      width: 350,
      height: 350,
      borderRadius: 50
    },
    manageCanButton: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        // backgroundColor: 'darkgrey',
        alignItems: 'center'
    },
    addCanButtonText: {
      // color: 'white'
    },
    manageCanText: {
        // color: 'black'
    },
    signInButton: {
        // backgroundColor: 'black',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%'
    },
    signInText: {
      // color: 'white'
    },
    datePicker: {
      // backgroundColor: '#F5FCFF'
    },
    numberOfCansInput: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      // backgroundColor: 'white',
      borderRadius: 10,
      borderBottomWidth: 0.75
      // color: 'black'
    },
    datePickerContainer: {
      // backgroundColor: 'black'
    },
    emptyState: {
      flex: 1,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center'
    },
    listHeading: {
      fontSize: 16,
      fontWeight: 'bold'
    }
  });