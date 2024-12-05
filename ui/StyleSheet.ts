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
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      // borderBottomColor: 'white',
      borderBottomWidth: 0.5,
      marginTop: 10
    },
    memoriesView: {
      marginTop: 15,
      padding: 10,
      height: '80%'
    },
    memoryListItem: {
      flexDirection: 'row',
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
    datePickerButton: {
        padding: 10,
        borderRadius: 20,
        borderWidth: 0.5,
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
      flexDirection: 'row',
      gap: 15
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
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      marginVertical: 10,
      marginBottom: 15
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
    },
    editIcon: {
      marginLeft: 'auto'
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8
    },
    serialNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 20
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
      margin: 20,
      gap: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      justifyContent: 'space-between',
      padding: 15,
      paddingBottom: 0,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 5
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 0.8,
      paddingTop: 5,
      paddingBottom: 15,
      marginBottom: 10,
      alignItems: 'center'
    }
  });