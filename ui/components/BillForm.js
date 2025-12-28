import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet as RNStyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '../StyleSheet';
import DropDown from './DropDown';
import DatePicker from './DatePicker';
import { getBillTypeConfig } from '../config/billTypes';
import Icon from 'react-native-vector-icons/FontAwesome';

const BillForm = ({ 
  billType, 
  action, 
  actionLabel, 
  initialValues 
}) => {
  const config = getBillTypeConfig(billType);
  
  const [formValues, setFormValues] = useState(() => {
    const initial = {};
    config?.fields.forEach(field => {
      initial[field.key] = initialValues?.[field.key] ?? field.default ?? '';
    });
    return initial;
  });

  const updateField = (key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    action(formValues);
  };

  const renderField = (field, index) => {
    const value = formValues[field.key] ?? '';
    const isRequired = field.required;

    switch (field.type) {
      case 'dropdown':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{field.label}</Text>
              {isRequired && <Text style={styles.required}>*</Text>}
            </View>
            <View style={styles.dropdownWrapper}>
              <DropDown
                data={field.options}
                labelFd="label"
                valueFd="value"
                value={value}
                setValue={(val) => updateField(field.key, val)}
                placeholder={field.placeholder || `Select ${field.label}`}
              />
            </View>
          </View>
        );

      case 'number':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{field.label}</Text>
              {isRequired && <Text style={styles.required}>*</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <Icon name="rupee" size={16} color="#666" style={styles.inputIcon} />
              <TextInput
                value={value?.toString() || ''}
                onChangeText={(val) => updateField(field.key, val)}
                style={styles.textInput}
                placeholder={field.placeholder}
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
          </View>
        );

      case 'date':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{field.label}</Text>
              {isRequired && <Text style={styles.required}>*</Text>}
            </View>
            <DatePicker
              selectedDate={value ? new Date(value) : new Date()}
              onDateChange={(val) => updateField(field.key, val.getTime())}
            />
          </View>
        );

      case 'text':
      default:
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{field.label}</Text>
              {isRequired && <Text style={styles.required}>*</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={value}
                onChangeText={(val) => updateField(field.key, val)}
                style={styles.textInput}
                placeholder={field.placeholder}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        );
    }
  };

  if (!config) {
    return (
      <SafeAreaView style={AppStyleSheet.manageCanContainer}>
        <Text>Invalid bill type</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Icon name={config.icon || 'file-text'} size={32} color="#1976d2" />
          <Text style={styles.headerTitle}>{config.label}</Text>
          <Text style={styles.headerSubtitle}>Fill in the details below</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {config.fields.map((field, index) => renderField(field, index))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Icon name="check" size={18} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.submitButtonText}>{actionLabel}</Text>
        </TouchableOpacity>

        <View style={{height: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
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
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#e53935',
    marginLeft: 4,
    fontSize: 14,
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
  dropdownWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#1976d2',
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

export default BillForm;
