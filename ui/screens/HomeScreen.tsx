import * as React from 'react';
import { Text, SafeAreaView, View, TouchableOpacity, ScrollView, StyleSheet as RNStyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    return (
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <MenuItem icon="lightbulb-o" title="Memories" subtitle="Notes & reminders" onPress={()=>navigation.navigate('Recall')} />
            <MenuItem icon="users" title="Chit Funds" subtitle="Group savings" onPress={()=>navigation.navigate('ChitFund')} />
            <MenuItem icon="home" title="Rent" subtitle="Tenant payments" onPress={()=>navigation.navigate('ListRent')} />
            <MenuItem icon="shield" title="LIC Policies" subtitle="Insurance records" onPress={()=>navigation.navigate('ListBills', {billType: 'lic'})} />
            <MenuItem icon="calendar" title="Date Calculator" subtitle="Days between dates" onPress={()=>navigation.navigate('DateCalculator')} />
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
  });