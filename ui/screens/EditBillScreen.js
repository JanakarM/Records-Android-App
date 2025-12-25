import React from 'react';
import { Alert } from 'react-native';
import BillForm from '../components/BillForm';
import { updateData } from '../utils/firestoreBroker';
import { getBillTypeConfig } from '../config/billTypes';

const COLLECTION = 'Bills';

const EditBillScreen = ({ route, navigation }) => {
  const { bill, billType } = route.params;
  const config = getBillTypeConfig(billType);

  const validateForm = (formValues) => {
    const missingFields = config.fields
      .filter(field => field.required && !formValues[field.key])
      .map(field => field.label);

    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleUpdate = (formValues) => {
    if (!validateForm(formValues)) return;

    updateData(COLLECTION, bill.id, formValues, () => {
      navigation.goBack();
    });
  };

  // Prepare initial values from the bill
  const initialValues = config.fields.reduce((acc, field) => {
    acc[field.key] = bill[field.key];
    return acc;
  }, {});

  return (
    <BillForm
      billType={billType}
      action={handleUpdate}
      actionLabel={`Update ${config?.label || 'Entry'}`}
      initialValues={initialValues}
    />
  );
};

export default EditBillScreen;
