import * as React from 'react';
import { useState } from 'react';
import { Text, SafeAreaView, View, TouchableOpacity, ScrollView, StyleSheet as RNStyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { exportData, importData, getBackupFilePath } from '../data/BackupUtil';

// Soft minimal palette
const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',  // Soft indigo
  text: '#37474f',
  textLight: '#78909c',
  border: '#eceff1',
};

const MenuItem = ({icon, title, subtitle, onPress}) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.iconWrap}>
      <Icon name={icon} size={18} color={COLORS.accent} />
    </View>
    <View style={styles.cardText}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-right" size={14} color={COLORS.textLight} />
  </TouchableOpacity>
);

export default function({navigation}){
    const [backupStatus, setBackupStatus] = useState('');

    const handleExport = async () => {
      Alert.alert(
        'Export Data',
        `Save all data to Downloads folder?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: async () => {
              setBackupStatus('Exporting...');
              const result = await exportData((status) => setBackupStatus(status));
              setBackupStatus('');
              if (result.success) {
                Alert.alert('Done', `${result.totalRecords} records exported`);
              } else {
                Alert.alert('Error', result.error);
              }
            },
          },
        ]
      );
    };

    const handleImport = async () => {
      setBackupStatus('Selecting file...');
      const result = await importData(undefined, (status) => setBackupStatus(status));
      setBackupStatus('');
      
      if (result.cancelled) return;
      if (result.success) {
        Alert.alert('Done', `${result.totalRecords} records imported`);
      } else {
        Alert.alert('Error', result.error);
      }
    };

    return (
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {backupStatus ? (
              <View style={styles.statusBar}>
                <Text style={styles.statusText}>{backupStatus}</Text>
              </View>
            ) : null}

            <MenuItem icon="lightbulb-o" title="Memories" subtitle="Notes & reminders" onPress={()=>navigation.navigate('Recall')} />
            <MenuItem icon="users" title="Chit Funds" subtitle="Group savings" onPress={()=>navigation.navigate('ChitFund')} />
            <MenuItem icon="home" title="Rent" subtitle="Tenant payments" onPress={()=>navigation.navigate('ListRent')} />
            <MenuItem icon="shield" title="LIC Policies" subtitle="Insurance records" onPress={()=>navigation.navigate('ListBills', {billType: 'lic'})} />
            <MenuItem icon="calendar" title="Date Calculator" subtitle="Days between dates" onPress={()=>navigation.navigate('DateCalculator')} />

            <Text style={styles.sectionTitle}>Data</Text>
            <View style={styles.backupRow}>
              <TouchableOpacity style={styles.backupBtn} activeOpacity={0.7} onPress={handleExport}>
                <Icon name="cloud-upload" size={16} color={COLORS.accent} />
                <Text style={styles.backupText}>Export</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backupBtn} activeOpacity={0.7} onPress={handleImport}>
                <Icon name="cloud-download" size={16} color={COLORS.accent} />
                <Text style={styles.backupText}>Import</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
    )
}

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    padding: 16,
  },
  statusBar: {
    backgroundColor: COLORS.accent + '15',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  statusText: {
    color: COLORS.accent,
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
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
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.accent + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 4,
  },
  backupRow: {
    flexDirection: 'row',
    gap: 10,
  },
  backupBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  backupText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
});