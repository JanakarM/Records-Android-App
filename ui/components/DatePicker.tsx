import React, {useState} from 'react';
import {Modal, TouchableOpacity, View, StyleSheet} from 'react-native';
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

  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.dateButton}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Icon name='calendar' size={18} color="#1976d2" style={styles.calendarIcon} />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <Icon name='chevron-down' size={14} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name='times' size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              mode="single"
              date={selectedDate}
              onChange={({date}) => {
                if (date) {
                  const timestamp = new Date(date.toString()).getTime();
                  if (!isNaN(timestamp)) {
                    dateChanged(new Date(timestamp));
                  }
                }
              }}
            />
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarIcon: {
    marginRight: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  doneButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});