import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import Styles from '../StyleSheet';

export default function App({date, updateSelectedDate}) {
  
  return (
    <View style={Styles.emptyState}>
      <Text >oops! There's no data here!</Text>
    </View>
  )
}