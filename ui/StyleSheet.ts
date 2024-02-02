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
    manageCanButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'grey'
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
    }
  });