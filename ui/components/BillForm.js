import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableHighlight, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyleSheet from '../StyleSheet';
import DropDown from './DropDown';
import { getBillTypeConfig } from '../config/billTypes';

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

  const renderField = (field) => {
    const value = formValues[field.key] ?? '';

    switch (field.type) {
      case 'dropdown':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={StyleSheet.listHeading}>{field.label}</Text>
            <DropDown
              data={field.options}
              labelFd="label"
              valueFd="value"
              value={value}
              setValue={(val) => updateField(field.key, val)}
              placeholder={field.placeholder || `Select ${field.label}`}
            />
          </View>
        );

      case 'number':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={StyleSheet.listHeading}>{field.label}</Text>
            <TextInput
              value={value?.toString() || ''}
              onChangeText={(val) => updateField(field.key, val)}
              style={StyleSheet.numberOfCansInput}
              placeholder={field.placeholder}
              keyboardType="number-pad"
            />
          </View>
        );

      case 'text':
      default:
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={StyleSheet.listHeading}>{field.label}</Text>
            <TextInput
              value={value}
              onChangeText={(val) => updateField(field.key, val)}
              style={StyleSheet.numberOfCansInput}
              placeholder={field.placeholder}
            />
          </View>
        );
    }
  };

  if (!config) {
    return (
      <SafeAreaView style={StyleSheet.manageCanContainer}>
        <Text>Invalid bill type</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.manageCanContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {config.fields.map(renderField)}

        <TouchableHighlight
          style={[StyleSheet.manageCanButton, styles.submitButton]}
          underlayColor="#DDDDDD"
          onPress={handleSubmit}
        >
          <Text style={StyleSheet.addCanButtonText}>{actionLabel}</Text>
        </TouchableHighlight>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  fieldContainer: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 30,
  },
};

export default BillForm;
