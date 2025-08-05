import React, { useState } from 'react';
import { 
  Text, 
  View, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import DatePicker from '../components/DatePicker';
import { calculateDate, formatDate } from '../utils/dateUtil';

export default function DateCalculatorScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [days, setDays] = useState('0');
  const [resultDate, setResultDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCalculate = () => {
    const daysNumber = parseInt(days);
    if (!isNaN(daysNumber)) {
      const result = calculateDate(startDate, daysNumber);
      setResultDate(result);
    }
  };
  
  const handleDaysChange = (text: string) => {
    setDays(text);
    // Hide result when input changes
    setResultDate(null);
  };

  const handleDateChange = (date: Date) => {
    setStartDate(date);
    setShowDatePicker(false);
    // Hide result when input changes
    setResultDate(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>Date Calculator</Text>
            <Text style={styles.subtitle}>Calculate a target date by adding or subtracting days</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date:</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of Days:</Text>
              <TextInput
                style={styles.numberInput}
                value={days}
                onChangeText={handleDaysChange}
                keyboardType="number-pad"
                placeholder="Enter days (positive or negative)"
              />
              <Text style={styles.hint}>
                (Use positive numbers to add days, negative to subtract)
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={handleCalculate}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            
            {resultDate && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Result:</Text>
                <Text style={styles.resultDate}>{formatDate(resultDate)}</Text>
                <Text style={styles.resultExplanation}>
                  {parseInt(days) >= 0 
                    ? `${days} days after ${formatDate(startDate)}`
                    : `${Math.abs(parseInt(days))} days before ${formatDate(startDate)}`
                  }
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DatePicker
            onDateChange={handleDateChange}
            selectedDate={startDate}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  calculateButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 8,
  },
  resultExplanation: {
    fontSize: 14,
    color: '#666',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
