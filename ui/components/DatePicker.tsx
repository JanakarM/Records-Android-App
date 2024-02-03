import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import Styles from '../StyleSheet';

export default function App({date, updateSelectedDate}) {
  
  return (
    <DateTimePicker
        mode="single"
        date={date}
        onChange={({date}) => {
                updateSelectedDate(date);
            }
        }
      />
  )
}