import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Alert, TouchableHighlight } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import StyleSheet from '../StyleSheet';
import EmptyState from '../components/EmptyState';
import { deleteData, getSnapShot } from '../utils/firestoreBroker';
import { getBillTypeConfig, getFrequencyLabel } from '../config/billTypes';

const COLLECTION = 'Bills';

const BillListItem = ({ bill, onDelete, onEdit, index }) => {
  const config = getBillTypeConfig(bill.billType);

  return (
    <Pressable
      onLongPress={() => onDelete(bill.id)}
      style={StyleSheet.memoryListItem}
    >
      <Text style={StyleSheet.serialNumber}>{index}</Text>
      <View style={styles.billContent}>
        <Text style={styles.billTitle}>
          {config?.getDisplayTitle(bill)}
        </Text>
        <Text style={styles.billSubtitle}>
          {config?.getDisplaySubtitle(bill)}
        </Text>
        <Text style={styles.billAmount}>
          {config?.getDisplayAmount(bill)}
        </Text>
        <Text style={styles.frequency}>
          {getFrequencyLabel(bill.frequency)}
        </Text>
      </View>
      <Icon
        onPress={() => onEdit(bill)}
        name="edit"
        size={25}
        color="blue"
        style={StyleSheet.editIcon}
      />
    </Pressable>
  );
};

const ListBillsScreen = ({ route, navigation }) => {
  const { billType } = route.params;
  const config = getBillTypeConfig(billType);
  const [bills, setBills] = useState([]);

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this entry?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteData(COLLECTION, id),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleEdit = (bill) => {
    navigation.navigate('EditBill', { bill, billType });
  };

  const handleCreate = () => {
    navigation.navigate('CreateBill', { billType });
  };

  const onSnapshot = async (docs) => {
    const billsList = [];
    docs.forEach((doc, i) => {
      billsList.push({
        ...doc.data(),
        id: doc.id,
        index: i + 1,
      });
    });
    setBills(billsList);
  };

  var unsubscribeFn;
  useEffect(() => {
    getSnapShot(COLLECTION, onSnapshot).then((unsubscribe) => {
      unsubscribeFn = unsubscribe;
    });
    return () => unsubscribeFn && unsubscribeFn();
  }, []);

  return (
    <SafeAreaView style={StyleSheet.manageCanContainer}>
      <TouchableHighlight
        style={StyleSheet.manageCanButton}
        underlayColor="#DDDDDD"
        onPress={handleCreate}
      >
        <Text style={StyleSheet.addCanButtonText}>Add {config?.label}</Text>
      </TouchableHighlight>

      <View style={StyleSheet.memoriesView}>
        <Text style={StyleSheet.listHeading}>{config?.label}s</Text>
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={EmptyState}
          renderItem={({ item }) => (
            <BillListItem
              bill={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
              index={item.index}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  billContent: {
    flex: 1,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  billSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  billAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 4,
  },
  frequency: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
};

export default ListBillsScreen;
