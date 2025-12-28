import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Alert, TouchableOpacity, StyleSheet as RNStyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { deleteData, getSnapShot } from '../data/DataBrokerProvider';
import { getBillTypeConfig, getFrequencyLabel } from '../config/billTypes';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
};

const COLLECTION = 'Bills';

const BillListItem = ({ bill, onDelete, onEdit }) => {
  const config = getBillTypeConfig(bill.billType);

  return (
    <Pressable onLongPress={() => onDelete(bill.id)} style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon name="shield" size={16} color={COLORS.accent} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{config?.getDisplayTitle(bill)}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {config?.getDisplaySubtitle(bill)} · {getFrequencyLabel(bill.frequency)}
        </Text>
      </View>
      <Text style={styles.amount}>{config?.getDisplayAmount(bill)}</Text>
      <TouchableOpacity onPress={() => onEdit(bill)}>
        <Icon name="chevron-right" size={14} color={COLORS.textLight} />
      </TouchableOpacity>
    </Pressable>
  );
};

const ListBillsScreen = ({ route, navigation }) => {
  const { billType } = route.params;
  const config = getBillTypeConfig(billType);
  const [bills, setBills] = useState([]);

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Delete this entry?', [
      { text: 'Delete', style: 'destructive', onPress: () => deleteData(COLLECTION, id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleEdit = (bill) => navigation.navigate('EditBill', { bill, billType });
  const handleCreate = () => navigation.navigate('CreateBill', { billType });

  const onSnapshot = async (docs) => {
    const billsList = [];
    docs.forEach((doc, i) => {
      billsList.push({ ...doc.data(), id: doc.id, index: i + 1 });
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="folder-open-o" size={40} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No policies yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <BillListItem bill={item} onDelete={handleDelete} onEdit={handleEdit} />
        )}
      />
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={handleCreate}>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.accent + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 12,
  },
});

export default ListBillsScreen;
