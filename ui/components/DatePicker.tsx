import React, {useEffect, useState} from 'react';
import {Modal, TouchableHighlight, View} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import Styles from '../StyleSheet';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function App({selectedDate, onDateChange}: DatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dateString, setDateString] = useState(new Date(selectedDate).toDateString());
  const dateChanged = (date: Date) => {
    setDateString(new Date(date).toDateString());
    onDateChange(date);
  }
  return (
    <View>
      <View style={Styles.datePickerContainer}>
        <Text style={{...Styles.listHeading, lineHeight: 15}}>Date</Text>
        <TouchableHighlight 
        style={Styles.datePickerButton}
        underlayColor="#DDDDDD"
        onPress={() => setModalVisible(true)}
        >
          <View
          style={{
            flexDirection: 'row',
            gap: 15,
            alignItems: 'center'
          }}
          >
            <Text>{dateString}</Text>
            <Icon
              size={20}
              name='calendar'
            />
          </View>
        </TouchableHighlight>
      </View>
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
      >
        <View style={Styles.centeredView}>
          <View style={Styles.modalView}>
            <View style={Styles.modalHeader}>
              <Text style={Styles.listHeading}>Select Date</Text>
              <Icon
              size={30}
              name='close'
              onPress={() => setModalVisible(false)}
              />
            </View>
            <DateTimePicker
              mode="single"
              date={selectedDate}
              yearContainerStyle={Styles.datePickerContainer}
              monthContainerStyle={Styles.datePickerContainer}
              onChange={({date}) => {
                    if (date) {
                      // Handle any date type by converting to timestamp first
                      const timestamp = new Date(date.toString()).getTime();
                      if (!isNaN(timestamp)) {
                        dateChanged(new Date(timestamp));
                      }
                    }
                  }
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}