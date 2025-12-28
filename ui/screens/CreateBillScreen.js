import React from 'react';
import { Alert } from 'react-native';
import BillForm from '../components/BillForm';
import { insertData } from '../data/DataBrokerProvider';
import { getBillTypeConfig } from '../config/billTypes';

const COLLECTION = 'Bills';

const CreateBillScreen = ({ route, navigation }) => {
  const { billType } = route.params;
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

  const handleCreate = (formValues) => {
    if (!validateForm(formValues)) return;

    const billData = {
      billType,
      time: new Date().getTime(),
      ...formValues,
    };

    insertData(COLLECTION, billData, () => {
      navigation.goBack();
    });
  };

  return (
    <BillForm
      billType={billType}
      action={handleCreate}
      actionLabel={`Add ${config?.label || 'Entry'}`}
    />
  );
};

export default CreateBillScreen;
