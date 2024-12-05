import React, {useEffect, useState} from 'react';
import {Modal, TouchableHighlight, View} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import Styles from '../StyleSheet';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App({date, updateSelectedDate}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dateString, setDateString] = useState(new Date(date).toDateString());
  const dateChanged = (selectedDate) => {
    setDateString(new Date(selectedDate).toDateString());
    updateSelectedDate(selectedDate);
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
              date={date}
              yearContainerStyle={Styles.datePickerContainer}
              monthContainerStyle={Styles.datePickerContainer}
              onChange={({date}) => {
                    dateChanged(date);
                  }
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}