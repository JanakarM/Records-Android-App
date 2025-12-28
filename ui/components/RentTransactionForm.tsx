import { useState } from "react";
import { TextInput, TouchableOpacity, View, ScrollView, StyleSheet as RNStyleSheet } from "react-native";
import { Text } from "react-native-elements"
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from './DatePicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const RentTransactionForm = ({action, actionLabel, pDate, pDue}) => {
    const [date, setDate] = useState(pDate)
    const [due, setDue] = useState(pDue)

    return (
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerCard}>
              <Icon name="credit-card" size={32} color="#4caf50" />
              <Text style={styles.headerTitle}>Rent Payment</Text>
              <Text style={styles.headerSubtitle}>Record a rent payment</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.label}>Payment Date</Text>
              <DatePicker selectedDate={new Date(date)} onDateChange={(dt) => setDate(dt.getTime())} />

              <Text style={[styles.label, {marginTop: 20}]}>Amount Paid <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Icon name="rupee" size={16} color="#666" style={styles.inputIcon} />
                <TextInput
                  value={due}
                  onChangeText={c=>setDue(c)}
                  style={styles.textInput}
                  placeholder='Enter the rent amount'
                  placeholderTextColor='#999'
                  keyboardType='number-pad'
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={() => action(date, due)}
            >
              <Icon name="check" size={18} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.submitButtonText}>{actionLabel}</Text>
            </TouchableOpacity>

            <View style={{height: 30}} />
          </ScrollView>
        </SafeAreaView>
    );
}

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#e53935',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RentTransactionForm;